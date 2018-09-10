{
    let view = {
        el:'.tabContent > .page-1',
        init(){
            this.$el = $(this.el);
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.bindEvents();
            this.loadmodule1();
            this.loadmodule2();
        },
        bindEvents(){
            window.eventHub.on('selectItem',(tagName)=>{
                if(tagName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadmodule1(){
            let script1 = document.createElement('script');
            script1.src = "./js/page-1-1.js"
            document.body.appendChild(script1)
        },
        loadmodule2(){
            let script2 = document.createElement('script');
            script2.src = "./js/page-1-2.js"
            document.body.appendChild(script2)
        }
    }

controller.init(view,model);
}