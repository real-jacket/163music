{
    let view = {
        el: '.siteNav',
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
            this.bindeEvents();
        },
        bindeEvents(){
            this.view.$el.on('click','.tabItems > li', (e)=>{
                let $li = $(e.currentTarget);
                $li.addClass('active')
                    .siblings().removeClass('active');
                let tagName = $li.attr('data-tagName')
                window.eventHub.emit('selectItem',tagName)
            })
        }
    }

    controller.init(view,model)
}