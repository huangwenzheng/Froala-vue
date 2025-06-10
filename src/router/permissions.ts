// 定义菜单项的接口
export interface MenuItem {
  id: number
  show_name: string
  name: string
  parent_id: number
  children: MenuItem[]
}

// 从原JS文件导入数据并提供类型
export const permissionMenus: MenuItem[] = [
    {
        "id": 2,
        "show_name": "市场",
        "name": "market",
        "parent_id": 0,
        "children": [
            {
                "id": 22,
                "show_name": "落地页需求",
                "name": "market/landing_page/list",
                "parent_id": 2,
                "children": [
                    {
                        "id": 23,
                        "show_name": "添加",
                        "name": "market/landing_page/add",
                        "parent_id": 22,
                        "children": []
                    },
                    {
                        "id": 24,
                        "show_name": "编辑", 
                        "name": "market/landing_page/edit",
                        "parent_id": 22,
                        "children": []
                    },
                    {
                        "id": 25,
                        "show_name": "删除",
                        "name": "market/landing_page/delete",
                        "parent_id": 22,
                        "children": []
                    }
                ]
            },
            {
                "id": 51,
                "show_name": "落地页联调",
                "name": "market/page_test/test",
                "parent_id": 2,
                "children": []
            }
        ]
    },
    {
        "id": 3,
        "show_name": "项目组",
        "name": "project",
        "parent_id": 0,
        "children": [
            {
                "id": 71,
                "show_name": "产品信息申请",
                "name": "project/info/list",
                "parent_id": 3,
                "children": [
                    {
                        "id": 72,
                        "show_name": "添加",
                        "name": "project/info/add",
                        "parent_id": 71,
                        "children": []
                    },
                    {
                        "id": 73,
                        "show_name": "编辑",
                        "name": "project/info/edit",
                        "parent_id": 71,
                        "children": []
                    }
                ]
            }
        ]
    }
] 