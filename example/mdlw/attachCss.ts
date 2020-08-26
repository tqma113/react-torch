import { Mdlw } from "../../src";

export const attachCss: Mdlw = (app, server) => {
  app.use((req, res, next) => {
    res.locals = {
      styles: [
        {
          type: "link",
          href: "/static/css/test.css",
          preload: true,
        },
        // {
        //   type: 'link',
        //   href: '/static/css/antd.css',
        //   preload: true
        // }
      ],
    };
    next();
  });
};
