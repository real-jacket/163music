{
    let view = {
        el:'.tabContent > .page-2',
        init(){
            this.$el = $(this.el);
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.bindEvents();
        },
        bindEvents(){
            window.eventHub.on('selectItem',(tagName)=>{
                if(tagName === 'page-2'){
                    this.view.$el.addClass('active')
                        .siblings().removeClass('active')
                }
            })
        }
    }

controller.init(view,model);
}