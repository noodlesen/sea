var adminRoot = new Vue({
    el:'#main-container',
    data: {
        dataSource:'/adminka',
        formData:{},
        searchQuery: '',
        showEditForm:false,
        formOp:null,
        formOpCaption:{'add':'Add new point','edit':'Edit point'},
        form: [
            {group:1,col:4, elements:[
                {mark: ['geoId','geoName'], type:'ac-input'},
                {mark: 'pointName', type:'input', default:""}
                ]
            },
            {group:2,col:4, elements:[
                {mark: 'rtBch', type:'rating'},
                {mark: 'rtHst', type:'rating'},
                {mark: 'rtNat', type:'rating'},
                {mark: 'rtDiv', type:'rating'},
                {mark: 'rtShp', type:'rating'},
                {mark: 'rtKid', type:'rating'},
                {mark: 'rtClt', type:'rating'},
                {mark: 'rtFod', type:'rating'},
                {mark: 'rtNlf', type:'rating'}
                ]
            },
            {group:3,col:4, elements:[
                {mark: 'pointPop', type:'input', default:"1"},
                {mark: 'absMin', type:'input', default:"0"},
                {mark: 'recMin', type:'input', default:"0"},
                {mark: 'recMax', type:'input', default:"0"},
                {mark: 'absMax', type:'input', default:"0"}
                ]
            }
        ]
      },
    template: '<div id="demo">\
                <div id="toolbar"><button class="btn btn-xs btn-warning" v-on:click="addNew">+ ADD NEW</button></div>\
                <div class="divider"><br/></div>\
                <div v-show="showEditForm" id="editFormPlace">\
                    <h2>{{formOpCaption[formOp]}}</h2>\
                    <div class="divider"><br/></div>\
                    <div class="row">\
                        <template v-for="g in form">\
                            <div class="col-lg-{{g.col}}">\
                                <template v-for="e in g.elements">\
                                    <c-ac-input v-if="e.type==\'ac-input\'" :mark="e.mark" :caption="e.mark" :datasource="this.dataSource"></c-ac-input>\
                                    <c-input v-if="e.type==\'input\'" :mark="e.mark" :caption="e.mark" :default="e.default"></c-input>\
                                    <c-rating v-if="e.type==\'rating\'" :mark="e.mark" :caption="e.mark"></c-rating>\
                                </template>\
                            </div>\
                        </template>\
                    </div>\
                    <div class="divider"><br/></div>\
                    <div class="row">\
                        <div class="col-lg-3">\
                            <button class="btn btn-large btn-success" style="width:100%" @click="formCancel">CANCEL</button>\
                        </div>\
                        <div class="col-lg-3 col-lg-offset-6">\
                            <button class="btn btn-large btn-warning" style="width:100%">SUBMIT</button>\
                        </div>\
                    </div>\
                </div>\
                <div class="divider"><br/></div>\
                <div v-show="!showEditForm">\
                <form id="search">\
                    Search <input name="query" v-model="searchQuery">\
                </form>\
                  <c-grid mark="tablePoints"\
                    :filter-key="searchQuery">\
                  </c-grid>\
                </div></div>',

    methods:{
        loadTableData:function(){
            var self = this;
            getResults(this.dataSource, 'json', {action:"getTableData"}, function(res){
                if (res.status=='ok'){
                    self.$broadcast('eSetValue', {target:'tablePoints', data:{tableData:res.tableData, tableColumns:res.tableColumns}})
                    console.log(JSON.stringify(res.tableData));
                }
            });
        },
        loadFormData:function(did){
            var self = this;
            getResults(this.dataSource, 'json', {action:"getFormData", data_id:did}, function(res){
                if (res.status='ok'){
                    console.log(JSON.stringify(res));
                    res.formData.forEach(function(f){
                        console.log('broadcasting setvalue to '+f.mark);
                        self.$broadcast('eSetValue',{target:f.mark, data:f.data});
                    });
                }
            });
        },
        addNew:function(){
            this.resetAll();
            this.formOp='add';
            this.showEditForm=true;
        },
        editEntry:function(e){
            this.formOp='edit';
            this.showEditForm=true;
            this.loadFormData(e)
        },
        resetAll:function(){
            this.$broadcast('eResetAll');
        },
        formCancel:function(){
            this.resetAll();
            this.showEditForm=false;
        }
    },
    created:function(){
        this.loadTableData();
    },
    events:{
        eTableDblClick:function(e){
            console.log('dblclick with '+e.data+' from '+e.emitter);
            this.editEntry(e.data);
        },
        eUpdateFormData:function(e){
            var self = this;
            if(Array.isArray(e)){
                console.log('Got array!');
                e.forEach(function(v){
                    self.formData[v.mark]=v.cvalue;
                });
            } else {
                this.formData[e.mark]=e.cvalue;
            }
            
            //alert();
            console.log(JSON.stringify(this.formData));
        }
    }
});