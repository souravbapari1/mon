import { httpRequest, With } from '../src/core/http.handler';
export const DELETE = httpRequest<With<{ params: { name: "sourav" } }>>(async (req, res) => {
    console.log(req.params);
}).middleware((req, res, next) => {
    console.log(req.params);
    next();
}).middleware(async (req, res, next) => {
    console.log(req.query);
    next();
}).middleware(async (req, res, next) => {
    console.log(req.body);
    next();
}).middleware((req, res, next) => {
    req.params.name = "sourav";
    next();
}).middleware((req, res, next) => {
    res.status(200).send("Hello World");
});