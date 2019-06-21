var __mitem_site = __mitem_site || {};

__mitem_site.code_template = miTem.compile("<div>\n\
    {% if js %} javascript code: \
    <pre><code class='javascript code-js'>{{js}}</code></pre> \n\
    {% endif %} \
    template:\n\
    <pre><code class='twig code-tmpl'>{{template}}</code></pre> \n\
    input data:\n\
    <pre><code class='json code-json'>{{data}}</code></pre>\n\
    output: \n\
    <pre><code class='nohighlight'>{{output}}</code></pre>\n\
    <button data-toggle=\"modal\" data-target=\"#sandbox_modal\" class='try'>Try in sandbox</button>\n\
</div>");
__mitem_site.code = function(template, data, js) {
    eval(js);
    var tmpl = miTem.compile(template);
    var tmpl_data = {
        template: template,
        data: JSON.stringify(data, null, 4),
        output: tmpl(data),
        js: js,
    };
    return __mitem_site.code_template(tmpl_data);
};
__mitem_site.onLoad = function () {
    $(function () {
        $("._mitem_sniplet").each(function () {
            var that = $(this);
            var js = that.find($(".javascript")).text().trim() || null;
            var template = that.find($(".twig")).text().trim();
            var data = JSON.parse(that.find($(".json")).text());
            that.html(__mitem_site.code(template, data, js));
        });


        document.querySelectorAll('pre code').forEach(function(block) {
            hljs.highlightBlock(block);
        });
    });

    $('#sandbox_modal').on('show.bs.modal', function (event) {
        var $snipplet = $(event.relatedTarget.parentNode);

        var js = $snipplet.find($(".code-js")).text().trim() || null;
        var tmpl = $snipplet.find($(".code-tmpl")).text().trim();
        var data = JSON.parse($snipplet.find($(".code-json")).text());
        $("#sandbox-js").text(js);
        if (!js) $("#sandbox_modal .js-col").hide();
        else $("#sandbox_modal .js-col").show();
        $("#sandbox-tmpl").text(tmpl);
        $("#sandbox-data").text(JSON.stringify(data, null, 4));

        __mitem_site.sandbox_run(js, tmpl, data);

        $("#sandbox_modal .btn-primary").click(function () {
            var js = $("#sandbox-js").val();
            var tmpl = $("#sandbox-tmpl").val();
            var data = JSON.parse($("#sandbox-data").val());

            __mitem_site.sandbox_run(js, tmpl, data);
        })
    });
};


__mitem_site.sandbox_run = function (js, tmpl, data) {
    eval(js);
    var template = miTem.compile(tmpl);
    $(".sandbox-output").text(template(data));
    $(".sandbox-output").addClass("fade-effect");
    window.setTimeout(function () {
        $(".sandbox-output").removeClass("fade-effect");
    }, 1000);
};
var require = function (lib) {return eval(lib)};