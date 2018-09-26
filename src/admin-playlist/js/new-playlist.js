{
    let view = {
        el: '.newSong',
        template: `
            新建歌单
        `,
        render(data){
            $(this.el).html(this.template)
        },
        clearActive(){
            $(this.el).removeClass('active')
        },
        addActive(){
            $(this.el).addClass('active');
        }
    };
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.addActive();
            this.view.render(this.model.data)
            window.eventHub.on('new',()=>{
                this.view.addActive();
            })
            window.eventHub.on('click',()=>{
                this.view.clearActive();
            })
            this.bindEvents();
        },
        bindEvents(){
            $(this.view.el).on('click',()=>{
                window.eventHub.emit('new');
            })
        }
    }

    controller.init(view,model);
}