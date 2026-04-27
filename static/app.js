(() => {
const loadingOverlay = document.getElementById('loadingOverlay') || document.getElementById('globalLoading');
const relFilesPicker = document.getElementById('relFilesPicker');
const relFolderPicker = document.getElementById('relFolderPicker');
const hiddenRelFiles = document.getElementById('hiddenRelFiles');
const fileListBody = document.getElementById('fileListBody');
const fileCount = document.getElementById('fileCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const clearAllBtn2 = document.getElementById('clearAllBtn2');
const uploadForm = document.getElementById('uploadForm');
const selectionSummary = document.getElementById('selectionSummary');
const baseFileInput = document.getElementById('baseFile');
const baseSheetSelect = document.getElementById('baseSheetSelect');
let selectedFiles = [];

function hideLoading(){if(!loadingOverlay)return;loadingOverlay.classList.remove('is-visible');loadingOverlay.classList.add('is-hidden')}
function showLoading(){if(!loadingOverlay)return;loadingOverlay.classList.remove('is-hidden');loadingOverlay.classList.add('is-visible')}
function formatBytes(bytes){if(!bytes)return '0 KB';const units=['B','KB','MB','GB'];const index=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1);return `${(bytes/Math.pow(1024,index)).toFixed(index===0?0:1)} ${units[index]}`}
function showFileName(input){const targetId=input.dataset.fileLabel;if(!targetId)return;const target=document.getElementById(targetId);if(!target)return;const files=Array.from(input.files||[]);if(files.length===0){target.textContent='';target.classList.remove('has-file');return}target.textContent=files.length===1?files[0].name:`${files.length} arquivos selecionados`;target.classList.add('has-file')}
document.querySelectorAll('input[type="file"][data-file-label]').forEach(input=>input.addEventListener('change',()=>showFileName(input)));
document.querySelectorAll('.js-processing-form').forEach(form=>form.addEventListener('submit',()=>{if(form.checkValidity())showLoading()}));

function setSheetOptions(options){if(!baseSheetSelect)return;baseSheetSelect.innerHTML='';options.forEach(item=>{const option=document.createElement('option');option.value=item.value;option.textContent=item.label;baseSheetSelect.appendChild(option)})}
async function loadBaseSheets(){const file=baseFileInput?.files?.[0];showFileName(baseFileInput);if(!file){setSheetOptions([{value:'',label:'Carregue a planilha base primeiro'}]);return}const formData=new FormData();formData.append('base_file',file);setSheetOptions([{value:'',label:'Lendo abas da planilha...'}]);try{const response=await fetch('/esocial/abas-base',{method:'POST',body:formData});const data=await response.json();if(!response.ok||!data.ok){setSheetOptions([{value:'',label:data.error||'Não foi possível ler as abas'}]);return}const sheets=data.sheets||[];if(sheets.length<=1){setSheetOptions([{value:sheets[0]||'',label:sheets[0]||'Planilha principal'}]);return}setSheetOptions([{value:'',label:'Selecione a aba do mês'},...sheets.map(sheet=>({value:sheet,label:sheet}))])}catch{setSheetOptions([{value:'',label:'Erro ao carregar abas'}])}}
function isValidRelFile(file){return ['.xls','.xlsx','.html','.htm'].some(ext=>file.name.toLowerCase().endsWith(ext))}
function buildKey(file){return `${file.name}__${file.size}__${file.lastModified}`}
function syncHiddenInput(){if(!hiddenRelFiles)return;const dt=new DataTransfer();selectedFiles.forEach(item=>dt.items.add(item.file));hiddenRelFiles.files=dt.files}
function updateSummary(){if(!fileCount||!selectionSummary)return;const total=selectedFiles.length;const size=selectedFiles.reduce((acc,item)=>acc+item.file.size,0);fileCount.textContent=`${total} arquivo(s)`;selectionSummary.textContent=total===0?'Nenhum arquivo selecionado.':`${total} arquivo(s) prontos. Tamanho total: ${formatBytes(size)}.`}
function renderFileList(){if(!fileListBody)return;fileListBody.innerHTML='';if(selectedFiles.length===0){fileListBody.innerHTML='<tr class="empty-row"><td colspan="4">Nenhum RELFUNCGERAL selecionado.</td></tr>';updateSummary();syncHiddenInput();return}selectedFiles.forEach((item,index)=>{const tr=document.createElement('tr');tr.innerHTML=`<td><strong>${item.file.name}</strong></td><td>${formatBytes(item.file.size)}</td><td>${item.source}</td><td><button type="button" class="btn btn--danger remove-btn" data-index="${index}">Retirar</button></td>`;fileListBody.appendChild(tr)});document.querySelectorAll('.remove-btn').forEach(btn=>btn.addEventListener('click',()=>{selectedFiles.splice(Number(btn.dataset.index),1);renderFileList()}));updateSummary();syncHiddenInput()}
function addFiles(fileList,sourceLabel){const existingKeys=new Set(selectedFiles.map(item=>buildKey(item.file)));let ignored=0;Array.from(fileList).forEach(file=>{if(!isValidRelFile(file)){ignored+=1;return}const key=buildKey(file);if(existingKeys.has(key))return;const source=file.webkitRelativePath||sourceLabel;selectedFiles.push({file,source});existingKeys.add(key)});renderFileList();if(ignored>0)alert(`${ignored} arquivo(s) foram ignorados porque não são .xls, .xlsx, .html ou .htm.`)}
function clearRelFiles(){selectedFiles=[];renderFileList();hideLoading()}
if(baseFileInput)baseFileInput.addEventListener('change',loadBaseSheets);
if(relFilesPicker)relFilesPicker.addEventListener('change',e=>{addFiles(e.target.files,'Seleção individual');e.target.value=''});
if(relFolderPicker)relFolderPicker.addEventListener('change',e=>{addFiles(e.target.files,'Pasta');e.target.value=''});
if(clearAllBtn)clearAllBtn.addEventListener('click',clearRelFiles);
if(clearAllBtn2)clearAllBtn2.addEventListener('click',clearRelFiles);
if(uploadForm)uploadForm.addEventListener('submit',e=>{if(selectedFiles.length===0){e.preventDefault();hideLoading();alert('Selecione pelo menos um arquivo RELFUNCGERAL.');return}const optionsCount=baseSheetSelect?.options?.length||0;const selectedSheet=baseSheetSelect?.value||'';if(optionsCount>1&&!selectedSheet){e.preventDefault();hideLoading();alert('Selecione a aba da planilha base.');return}syncHiddenInput();showLoading()});
const cpfInput=document.getElementById('cpf');
function applyCpfMask(value){const digits=(value||'').replace(/\D/g,'').slice(0,11);return digits.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2')}
if(cpfInput){cpfInput.addEventListener('input',e=>{e.target.value=applyCpfMask(e.target.value)});cpfInput.value=applyCpfMask(cpfInput.value)}
function filterSelect(selectEl,searchText){const term=(searchText||'').toUpperCase();let firstVisible=null;Array.from(selectEl.options).forEach(opt=>{const visible=!term||opt.text.toUpperCase().includes(term);opt.hidden=!visible;if(visible&&!firstVisible)firstVisible=opt});return firstVisible}
function bindSearch(searchEl,selectEl,hiddenEl,chipEl,emptyText){if(!searchEl||!selectEl||!hiddenEl||!chipEl)return;searchEl.addEventListener('input',()=>{const firstVisible=filterSelect(selectEl,searchEl.value);if(firstVisible)firstVisible.selected=true});selectEl.addEventListener('change',()=>{const selected=selectEl.options[selectEl.selectedIndex];if(!selected)return;hiddenEl.value=selected.value;chipEl.textContent=selected.value||emptyText});const initialSelected=selectEl.options[selectEl.selectedIndex];if(initialSelected&&initialSelected.value){hiddenEl.value=initialSelected.value;chipEl.textContent=initialSelected.value}}
bindSearch(document.getElementById('empresa_search'),document.getElementById('empresa_select'),document.getElementById('empresa_nome'),document.getElementById('empresaEscolhida'),'Nenhuma empresa selecionada');
bindSearch(document.getElementById('cargo_search'),document.getElementById('cargo_select'),document.getElementById('funcao_nome'),document.getElementById('cargoEscolhido'),'Nenhum cargo selecionado');
window.addEventListener('load',()=>{hideLoading();if(fileListBody)renderFileList()});
window.addEventListener('pageshow',hideLoading);
hideLoading();

})();
