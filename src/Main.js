class Main {
    constructor(){
        this.files = []
        this.folders = []

        this.inputList = document.querySelectorAll('.js_input_files')
        this.filesContainer = document.querySelector('.js_files_container')
        this.text = document.querySelector('.js_provisory_text')
        this.folderBtn = document.querySelector('.js_create_folder')
        this.renameBtn = document.querySelector('.js_rename_file')
        this.deleteBtn = document.querySelector('.js_delete_file')
        this.downloadBtn = document.querySelector('.js_download_zip')

        this.isRenaming = false;
        this.isDeleting = false
        this.renameIndex = -1;
        this.renameItems = [];

        this.init()
    }

    init(){
       let self = this;
        this.inputList.forEach(function(input) {
            input.addEventListener('change', function(e) {
                self.onFileChange(e.target.files);
            })
        })

        this.folderBtn.addEventListener('click', function(e){
            e.preventDefault()
            self.createFolder()
        })

        this.renameBtn.addEventListener('click', function(e){
            e.preventDefault()
            self.isRenaming = true;
            self.renameItems = Array.from(document.querySelectorAll('.file_item, .folder-header'));
            self.renameIndex = 0;
            alert('Utilisez WASD pour sélectionner. Appuyez sur Entrée pour renommer.');
            self.updateRenameHighlight();
            
        })

        this.deleteBtn.addEventListener('click', function(e){
            e.preventDefault()
            self.isDeleting = true
            self.renameItems = Array.from(document.querySelectorAll('.file_item, .folder-header'))
            self.renameIndex = 0
            alert('Utilisez WASD pour sélectionner un fichier puis appuyez sur Entrée pour supprimer. Attention: la suppression est permanente.')
            self.updateRenameHighlight()
            console.log(self.isDeleting)
        })

        this.downloadBtn.addEventListener('click', function(e){
            e.preventDefault()
            
            if(self.files.length == 0){
                alert('Veuillez téléverser au moins un fichier.')
            }

            else{
                self.downloadFiles()
            }
        })

        //KEY INPUT

        
        document.addEventListener('keydown', function(e) {
            console.log('allo')
            // prevent key interference if typing in a text field
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (!self.isRenaming && !self.isDeleting) return;

            // Move selection
            if (e.key === 's' || e.key === 'd' || e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                self.renameIndex = (self.renameIndex + 1) % self.renameItems.length;
                self.updateRenameHighlight();
                return;
            }

            if (e.key === 'w' || e.key === 'a' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                self.renameIndex = (self.renameIndex - 1 + self.renameItems.length) % self.renameItems.length;
                self.updateRenameHighlight();
                return;
            }

            // Rename mode: Enter triggers prompt
            if (self.isRenaming && e.key === 'Enter') {
                let current = self.renameItems[self.renameIndex];
                let oldName = current.textContent.trim().replace(/^📁 /, '');
                let newName = prompt("Nouveau nom :", oldName);
                if (newName) {
                    if (current.classList.contains('js_folder_header')) {
                        current.innerHTML = `<strong>📁 ${newName}</strong>`;
                    } else {
                        current.textContent = newName;
                    }
                }

                // Delay to prevent Enter from retriggering
                setTimeout(function () {
                    self.isRenaming = false;
                    self.renameItems = [];
                    self.renameIndex = -1;
                    self.updateRenameHighlight();
                }, 10);

        return;
    }

    // Delete mode: Enter confirms deletion
    if (self.isDeleting && e.key === 'Enter') {
        let current = self.renameItems[self.renameIndex];
        if (!current) return;

        let confirmDelete = confirm("Supprimer cet élément ?");
        if (confirmDelete) {
            let parentLi = current.closest('li');
            if (parentLi) {
                parentLi.remove();
            } else {
                current.remove();
            }
        }

        // Exit delete mode
        setTimeout(function () {
            self.isDeleting = false;
            self.renameItems = [];
            self.renameIndex = -1;
            self.updateRenameHighlight();
        }, 10);

        return;
    }

    // Escape: cancel both modes
    if (e.key === 'Escape') {
        self.isRenaming = false;
        self.isDeleting = false;
        self.renameItems = [];
        self.renameIndex = -1;
        self.updateRenameHighlight();
        console.log('Action annulée');
        return;
    }
});


    }

    onFileChange(fileList){
        this.files = Array.prototype.slice.call(fileList);

        console.log(this.files); 
        this.displayFiles();
    }

    displayFiles(){
        console.log(this.inputList)
        if (!this.inputList){
            this.filesContainer.innerHTML = ''
        }

        for (let i = 0; i < this.files.length; i++) {
            let file = this.files[i]
            this.text.classList.add('none')
            let li = document.createElement('li')
            li.setAttribute('draggable', true)
            li.classList.add('file_item')
            li.dataset.filename = file.name
            //let img = document.createElement('img')
            li.textContent = file.webkitRelativePath || file.name
            this.filesContainer.appendChild(li)

            li.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', e.target.dataset.filename);
            });
        }
    }

    //Création de dossiers
    createFolder() {
        let folderName = prompt("Nom du dossier ?")
        let dossier = document.createElement('li')

        if (!folderName) return;

        if (this.text && !this.text.classList.contains('none')) {
            this.text.classList.add('none')
        }

        dossier.classList.add('folder')
        dossier.innerHTML = `<div class="js_folder_header"><strong>📁 ${folderName}</strong></div><ul class="folder-contents"></ul>`
        this.filesContainer.appendChild(dossier)

        let folderContent = dossier.querySelector('.folder-contents')

        folderContent.addEventListener('dragover', function(e){
            e.preventDefault()
        })

        folderContent.addEventListener('drop', function(e){
            e.preventDefault()

            let filename = e.dataTransfer.getData('text/plain')

            let fileEl = document.querySelector('.file_item[data-filename="' + filename + '"]')
            if (fileEl) {
                folderContent.appendChild(fileEl)
                console.log(folderContent)
            }
        })

        let folderCollapse = document.querySelector('.js_folder_header')
        folderCollapse.addEventListener('click', function(){
            folderContent.classList.toggle('collapsed')
            console.log('collapsed')
        })

        console.log('Folder created:', folderName)
        //console.log(folderContent)
    }

    updateRenameHighlight(){
        this.renameItems.forEach((item, index)=>{
            item.classList.toggle('selected', index === this.renameIndex)
        })
    }

    downloadFiles() {
    let zip = new JSZip();

    // Add loose files (not in any folder)
    let looseFiles = Array.from(document.querySelectorAll('.file_item')).filter((fileEl) => {
        return !fileEl.closest('.folder'); // skip files already in folders
    });

    looseFiles.forEach((fileEl) => {
        let originalName = fileEl.dataset.filename;
        let fileObj = this.files.find(f => f.name === originalName);
        let displayedName = fileEl.textContent.trim();

        if (fileObj) {
            zip.file(displayedName, fileObj);
        }
    });

    // Add folders and their contents
    let folderEls = document.querySelectorAll('.folder');
    folderEls.forEach((folderEl) => {
        let folderHeader = folderEl.querySelector('.js_folder_header');
        if (!folderHeader) return;

        let folderName = folderHeader.textContent.replace(/^📁 /, '').trim();
        let folderContents = folderEl.querySelectorAll('.file_item');

        folderContents.forEach((fileEl) => {
            let originalName = fileEl.dataset.filename;
            let fileObj = this.files.find(f => f.name === originalName);
            let displayedName = fileEl.textContent.trim();

            if (fileObj) {
                zip.folder(folderName).file(displayedName, fileObj);
            }
        });
    });

    // Generate and download the zip
    zip.generateAsync({ type: "blob" }).then((content) => {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'folder_flow_download.zip';
        a.click();
    });
}


}

new Main()