{
    let view = {
        el: '.newSong',
        template: `
            新建歌曲
        `,
        render(data){
            $(this.el).html(this.template)
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
            window.eventHub.on('upload',()=>{
                this.view.addActive();
            })
        }
    }

    controller.init(view,model);
}