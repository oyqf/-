import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import developing from '@/components/developing'
import role from '@/components/system/role'
import privilege from '@/components/system/privilege'
import costPrice from '@/components/report/costPrice'
import inventoryQuantity from '@/components/report/inventoryQuantity'
import shortage from '@/components/report/shortage'
import outputSummary from '@/components/report/outputSummary'
import offlineSales from '@/components/report/offlineSales'
import onlineSales from '@/components/report/onlineSales'
import customerSummary from '@/components/report/customerSummary'
import SupplierQuery from '@/components/report/SupplierQuery'
import singlGoods from '@/components/report/singlGoodse'
import inStorageTOP from '@/components/report/inStorageTOP'
import singleOutPut from '@/components/report/singleOutPut'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta:{index:0}
    },
    {
      path: '/developing',   //开发中
      name: 'developing',
      component: developing,
      meta:{index:1}
    },
    {
      path: '/role',   //角色管理
      name: 'role',
      component: role,
      meta:{index:1},
    },
    {
      path: '/privilege',  //人员管理
      name: 'privilege',
      component: privilege,
      meta:{index:1},
    },
    {
      path: '/SupplierQuery',  //供应商查询
      name: 'SupplierQuery',
      component: SupplierQuery,
      meta:{index:1}
    },
    {
      path: '/singlGoods',  //单品采购查询
      name: 'singlGoods',
      component: singlGoods,
      meta:{index:1}
    },
    {
      path: '/inStorageTOP',  //到货TOP10
      name: 'inStorageTOP',
      component: inStorageTOP,
      meta:{index:1}
    },
    {
      path: '/inventoryQuantity',  //现存量
      name: 'inventoryQuantity',
      component: inventoryQuantity,
      meta:{index:1},
    },
    {
      path: '/costPrice',   //成本价
      name: 'costPrice',
      component: costPrice,
      meta:{index:1},
    },
    {
      path: '/shortage',    //备料查询
      name: 'shortage',
      component: shortage,
      meta:{index:1},
    },
    {
      path: '/outputSummary',    //产量汇总
      name: 'outputSummary',
      component: outputSummary,
      meta:{index:1},
    },
    {
      path: '/singleOutPut',    //单品产出查询
      name: 'singleOutPut',
      component: singleOutPut,
      meta:{index:1},
    },
    {
      path: '/offlineSales', //线下销售
      name: 'offlineSales',
      component: offlineSales,
      meta:{index:1},
    },
    {
      path: '/onlineSales',  //线上销售
      name: 'onlineSales',
      component: onlineSales,
      meta:{index:1},
    },
    {
      path: '/customerSummary',  //客户汇总
      name: 'customerSummary',
      component: customerSummary,
      meta:{index:1}
    }
  ]
})
