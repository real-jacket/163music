{
    let view = {
        el:'section.latestMusic',
        init(){
            this.$el = $(this.el);
        },
        template:`
        <li>
            <a href="./song.html?id={{song.id}}">
                <h3>{{song.name}}</h3>
                <p>{{song.singer}}-{{song.name}}</p>
                <svg class="play">
                    <use xlink:href="#icon-play-circled"></use>
                </svg>
            </a>
         </li>
        `,
        render(data){
            let {songs} = data;
            songs.map((song)=>{
                let $li = $(this.template
                    .replace(/{{song.name}}/g,song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                );
                this.$el.find('ol#latestMusic').append($li)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        },
        fetchAll(){
            var query = new AV.Query('Song');
            return query.find().then((x)=>{
                this.data.songs = x.map((song)=>{
                    return Object.assign({id:song.id} ,song.attributes)
                })
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.getAllsongs();
        },
        getAllsongs(){
            this.model.fetchAll().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view,model);
}