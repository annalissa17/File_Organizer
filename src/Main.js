class Main {
    constructor(){
        this.files = []
        this.inputList = document.querySelectorAll('.js_input_files')
        this.filesContainer = document.querySelector('.js_files_container')

        this.init()
    }

    init(){
       let self = this;
        this.inputList.forEach(function(input) {
            input.addEventListener('change', function(e) {
                self.onFileChange(e.target.files);
            });
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

            let li = document.createElement('li')
            li.textContent = file.webkitRelativePath || file.name
            this.filesContainer.appendChild(li)
        }
    }
}

new Main()