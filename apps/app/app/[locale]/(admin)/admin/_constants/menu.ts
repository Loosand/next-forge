const menus = [
  {
    title: "User",
    url: "/admin/user",
    items: [
      {
        title: "Manage",
        url: "/admin/user/manage",
      },
    ],
  },
  {
    title: "Task",
    url: "/admin/task",
    items: [
      {
        title: "Tasks",
        url: "/admin/task",
      },
      {
        title: "Assets",
        url: "/admin/asset",
      },
    ],
  },
  {
    title: "Test",
    url: "/admin/test",
    items: [
      {
        title: "Trigger",
        url: "/admin/test/trigger",
      },
      {
        title: "Upload",
        url: "/admin/test/upload",
      },
      {
        title: "Evlog",
        url: "/admin/test/evlog",
      },
      {
        title: "Fal",
        url: "/admin/test/fal",
      },
    ],
  },
];

export { menus };
