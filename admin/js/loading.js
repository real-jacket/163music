{
    let view = {
        el: '.site-loading',
        init(){
           this.$el = $(this.el)
        },
        show(){
            this.$el.show()
        },
        hide(){
            this.$el.hide()
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            window.eventHub.on('beforeupload',()=>{
                console.log('show')
                this.view.$el.show()
            })
            window.eventHub.on('afterupload',()=>{
                console.log('hide')
                this.view.$el.hide()
            })
        }
    }
    controller.init(view,model)
}