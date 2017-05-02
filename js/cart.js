let vm = new Vue( {
    el: '#app',
    data: {
        totalMoney:0,
        productList:[],
        checkAllFlag: false,
        curProduct:'',
        delFlag:''

    },
    filters:{ // 过滤器
       formatMoney:function ( value ) { // 局部过滤器
           return "￥"+value.toFixed(2);
       }
    },
    mounted:function ( ) { // 页面加载完成后会调用此函数
        this.$nextTick(function () { // 加个函数可以保证 this和vm是一样 都可以掉用
            vm.cartView();

        })
    },
    methods:{
        cartView:function () {
            this.$http.get('data/data.json',{"id":1}).then(res => { //作用域指向了外层 里面的this就是外面的this
                this.productList = res.body.result.list;
                // _this.productList = res.body.result.totalMoney;
            }); // 调用http方法
        },
        changeMoney:function ( product, way ) {
            if(way>0){
                product.productQuantity++;
            }else {
                product.productQuantity--;
                if(product.productQuantity<1) product.productQuantity=1
            }
            this.calcTotalPrice(); // 点击加减也执行计算总金额的方法
        },
        selectedProduct:function ( item  ) {
            if(typeof item.checked == 'undefined'){
                Vue.set(item,'checked',true);  // 全局注册 往item注册一个checked 值为true
                // this.$set(item,'checked',true);//局部注册 加$
            }else {
                item.checked = !item.checked; // 有了之后 点击是false
            }
            this.calcTotalPrice();
        },
        checkAll:function (flag) {
            this.checkAllFlag = flag;
            this.productList.forEach((item,index)=>  {
                if(typeof item.checked == 'undefined'){
                    this.$set(item,'checked',true);
                }else {
                    item.checked = this.checkAllFlag;
                }
                this.calcTotalPrice();
             })

        },
        calcTotalPrice:function () {
            this.totalMoney = 0 ; // 每一次执行之后把总金额清零
            this.productList.forEach((item,index)=>{
                if(item.checked){
                    this.totalMoney+= item.productPrice*item.productQuantity;
                }
            })
        },
        delConfirm:function ( item ) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct:function () {
            // this.delProduct.$delete(this.curProduct); vue1.0的版本 现在不支持了
            let index = this.productList.indexOf( this.curProduct);
            this.productList.splice(index,1);
            this.delFlag = false;
            this.calcTotalPrice();
        }

    },

});
Vue.filter('money',function ( value, type ) { //全局过滤器 好处就是所有的页面都可以使用这个过滤器
    return '￥'+value.toFixed(2)+type
});
