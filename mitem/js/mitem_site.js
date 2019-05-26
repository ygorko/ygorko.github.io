var __mitem_site = __mitem_site || {};

__mitem_site.code_template = miTem.compile("<div>\n\
    template:\n\
    <pre><code class='twig'>{{template}}</code></pre> \n\
    input data:\n\
    <pre><code class='json'>{{data}}</code></pre>\n\
    output: \n\
    <pre><code class='shell'>{{output}}</code></pre>\n\
    <button class='try'>Try in sandbox</button>\n\
</div>");
__mitem_site.code = function(template, data) {
    var tmpl = miTem.compile(template);
    var tmpl_data = {
        template: template,
        data: JSON.stringify(data, null, 4),
        output: tmpl(data)
    };
    return __mitem_site.code_template(tmpl_data);
};
__mitem_site.onLoad = function () {
    $(function () {
        $("._mitem_sniplet").each(function () {
            var that = $(this);
            var template = that.find($(".twig")).text().trim();
            var data = JSON.parse(that.find($(".json")).text());
            that.html(__mitem_site.code(template, data));
            that.find(".try").click(function () {
                __mitem_site.sandbox_run(template, data);
            });
        });


        document.querySelectorAll('pre code').forEach(function(block) {
            hljs.highlightBlock(block);
        });
    })
};

__mitem_site.sandbox = false;
__mitem_site.sandbox_run = function (template, data) {
    if (!__mitem_site.sandbox || __mitem_site.sandbox.closed) {
        __mitem_site.sandbox = window.open("sandbox.html", "Sandbox", "width=1100,height=400");
    }
    __mitem_site.sandbox.focus();

    var callback = function () {
        $(__mitem_site.sandbox.document).contents().find(".tmpl").val(template);
        $(__mitem_site.sandbox.document).contents().find(".data").val(JSON.stringify(data, null, 4));
        $(__mitem_site.sandbox.document).contents().find("#go").trigger("click");
    };

    __mitem_site.sandbox.onload = callback;
    $(__mitem_site.sandbox.document).ready(callback);

};
