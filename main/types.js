export var HookType;
(function (HookType) {
    HookType["onRequest"] = "onRequest";
    HookType["preHandler"] = "preHandler";
    HookType["postHandler"] = "postHandler";
    HookType["onSend"] = "onSend";
    HookType["onError"] = "onError";
    HookType["onClose"] = "onClose";
})(HookType || (HookType = {}));
