{
    let view = {
        el:'ol#latestMusic',
        init(){
            this.$el = $(this.el);
        },
        template:`
        <li>
            <a href="./song.html?id={{song.id}}">
                <span class="number">{{i}}</span>
                <div class="songinformaiton">
                    <div class="song">
                        <div class="songname">{{song.name}}</div>
                        <div class="songauthor">{{song.name}}-{{song.singer}}</div>
                    </div>
                    <span class="icon">
                        <svg class="play">
                            <use xlink:href="#icon-play-circled"></use>
                        </svg>
                    </span>
                </div>
            </a>     
        </li>
        `,
        render(data){
            let {songs} = data;
            let i= 0;
            songs.map((song)=>{
                i = i + 1 
                let $li = $(this.template
                    .replace('{{i}}',i)
                    .replace(/{{song.name}}/g,song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                );
                this.$el.append($li)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        },
        fetchAll(id){
            // 假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
            var Songlist = AV.Object.createWithoutData('SongList',id );
            var query = new AV.Query('Song');
            query.equalTo('dependent', Songlist);
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
            let id = this.getSonglistId();
            this.getAllsongs(id);
        },
        getAllsongs(id){
            this.model.fetchAll(id).then(()=>{
                this.view.render(this.model.data)
            })
        },
        getSonglistId(){
            let search = window.location.search;
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }

            let array = search.split('&').filter((v=>v))
            let id = '';
            for(let i = 0;i < array.length;i++){
                let kv = array[i].split('=');
                key = kv[0];
                value = kv[1];
                if(key === 'id'){
                    id = value;
                    break
                }
            }

            return id;
        }
    }

    controller.init(view,model);
}