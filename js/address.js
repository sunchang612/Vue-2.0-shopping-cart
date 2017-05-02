new Vue({
   el:'.container',
    data:{
       limitNum:3,
        addressList:[],
        currentIndex:0,
        shippingMethod:1
    },
    mounted:function () {
        this.$nextTick(function () {
            this.getAddressList();
        })
    },
    methods:{
       getAddressList:function () {
           this.$http.get('data/address.json').then(response=>{
               var res = response.data ;// 拿到json的数据
               if(res.status=="0"){
                   this.addressList = res.result;
               }

           })
       },
        setDefault(addressId){
           this.addressList.map( ( address, index )=> {
               if(address.addressId == addressId){
                   address.isDefault = true;
               }else {
                   address.isDefault = false;
               }
           })

        },
        delProduct(index){
            this.addressList.splice(index,1);
        }
        /*loadMore:function () {
            this.limitNum = this.addressList.length;
        }*/
    },
    computed:{
        filterAddress:function () {  // 过滤器 过滤数组
            return this.addressList.slice(0,this.limitNum);// 使页面默认只显示 3条数据
        }
    }
});













