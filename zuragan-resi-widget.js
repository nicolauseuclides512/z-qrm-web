(function () {

    'use strict';

    let jQuery;
    // let baseUrl = "https://development.zuragan.com/api/v1/pub";
    // let baseUrl = "https://api.zuragan.com/api/v1/pub";
    // let baseUrl = "localhost:9292/api/v1/pub";
    // let baseUrl = "http://localhost:8789/api/v1";
    // let baseUrl = "http://development.zuragan.com:8494/api/v1";
    let baseUrl = "https://ongkir.zuragan.com/api/v1";

    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.2.1') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "js/jquery-min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else { // Other browsers
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    function scriptLoadHandler() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    function init($) {

        //Set Css
        let $head = $("head");
        let $headlinkLast = $head.find("link[rel='stylesheet']:last");
        let bootstrapStyle = '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">';
        let widgetStyle = '<link rel="stylesheet" type="text/css" href="css/widget-min.css">';
        let customStyle = `<style>ul.typeahead.dropdown-menu {max-height: 200px;overflow: auto;}</style>`;

        let $headScriptLast = $head.find("script[type='text/javascript']:last");
        // let typeaheadScript = '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.js"></script>';
        let typeaheadScript = '<script type="text/javascript" src="unused/bootstrap3-typeahead-min.js"></script>';

        if ($headlinkLast.length) {
            $headScriptLast.after(typeaheadScript);
            $headlinkLast.after(bootstrapStyle);
            $headlinkLast.after(customStyle);
            $headlinkLast.after(widgetStyle);
        }
        else {
            $head.append(typeaheadScript);
            $head.append(bootstrapStyle);
            $head.append(customStyle);
            $head.append(widgetStyle);
        }

        resiForm($);


        $('#zuragan-resi-form').submit(function (event) {
            event.preventDefault();
            let $inputs = $('#zuragan-resi-form :input');
            getWaybillDetails($, $inputs);

        });

    }

    function resiForm($) {
        const widgetForm = `
        <!--<style>-->
            <!--.img-thumbnail {-->
                <!--border-color: white;-->
                <!--background-color: transparent;-->
                <!--/*width: 20px;*/-->
                <!--height: 40px;-->
                <!--float: left;-->
            <!--}-->
        <!--</style>-->

        <form class="form-inline text-center" id="zuragan-resi-form">
            <!--<div class="container-fluid">-->
                <!--<div class="row pt-0 pb-0">-->
                    <!--<div class="col-md-12 col-sm-12 col-xs-12">-->
                        <!--<div class="col-md-12 col-sm-12 col-xs-12" style="margin-top: 25px; background:#fff; border-radius:10px; box-shadow:0px 1px 4px 0px #ccc; padding:20px" id="form-main">-->
                            <p>&nbsp;</p>
                            <div class="col-md-12 col-sm-12 col-xs-12 align-center" style="padding: 10px">
                                <div class="col-md-2 col-sm-2 col-xs-2">
                                    <img src="asset_resi/track_g.png" class="img-thumbnail1">
                                </div>
                                <div class="col-md-10 col-sm-10 col-xs-10">
                                    <input type="text" name="resi_number" class="form-control" id="zuragan-resi-number" placeholder="Masukkan nomor resi" style="width:100%" required>
                                </div>
                            </div>
                            <div class="col-md-12 col-sm-12 col-xs-12 align-center" style="padding: 10px">
                                <div class="col-md-2 col-sm-2 col-xs-2">
                                    <img src="asset_resi/delivman_g.png" class="img-thumbnail1">
                                </div>
                                <div class="col-md-10 col-sm-10 col-xs-10">
                                    <select class="form-control" id="zuragan-carrier" name="ongkir_carrier" style="width:100%">
                                        <option>Pilih Kurir</option>
                                    </select>
                                </div>
                            </div>
                            <p>&nbsp;</p>
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <button type="submit" class="btn btn-primary" style="background-color: #FF5900; height: 40px; width: 200px">
                                Cek
                                </button>
                            </div>
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </form>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <div id="resi-results"></div>
    `;
        $("#zuragan-resi-widget").append($(widgetForm));
        setCarriersData($);
    }

    function setCarriersData($) {
        $.ajax({
            url: baseUrl + "/carriers/list",
            dataType: "JSON",
            type: "GET",
            async: true,
            success: function (response) {
                let carriersForm = $('#zuragan-carrier');
                carriersForm.empty();
                $.each(response.data, function (key, value) {
                    carriersForm.append('<option value=' + value['code'] + '>' + value['name'] + '</option>');
                });
            }
        });
    }

    function getWaybillDetails($, $inputs) {
        $('#resi-results').empty();
        $(':button[type="submit"]').prop('disabled', true);

        let data = {};
        let values = {};

        $inputs.each(function () {
            values[this.name] = {
                value: $(this).val(),
                id: $(this).attr('data-id'),
                type: $(this).attr('data-type')
            };
        });
        data.waybill = values.resi_number.value;
        data.courier = values.ongkir_carrier.value;

        $.ajax({
            url: baseUrl + "/check-waybill",
            data: data,
            dataType: "JSON",
            type: "POST",
            async: true,
            success: function (response) {
                let resultHtml = $('#resi-results');
                var courier_image;
                switch (data.courier) {
                    case "jne":
                        courier_image = "jne_id.png";
                        break;
                    case "pos":
                        courier_image = "pos_id.png";
                        break;
                    case "tiki":
                        courier_image = "tiki_id.png";
                        break;
                    case "wahana":
                        courier_image = "wahana_id.png";
                        break;
                    case "jnt":
                        courier_image = "jnt_id.png";
                        break;
                    case "pandu":
                        courier_image = "pandu.png";
                        break;
                    case "sicepat":
                        courier_image = "sicepat_id.png";
                        break;
                }
                let table = `
                <div class="row pt-0 pb-0">
                    <div class="col-md-12 col-sm-12 col-xs-12" style="background: linear-gradient(#56AB2F, #0F9B0F, #0F9B0F, hsl(50, 80%, 15%, 0.9)); height:200px; padding:15px 5% 0px 5%;">
                        <div class="col-md-12 col-sm-12 col-xs-12 style="margin-top: 25px; background:#fff; border-radius:10px; box-shadow:0px 1px 4px 0px #ccc; padding:20px">
                            <table>
                                <tr>
                                    <td style="width:42px"><img src="asset_resi/box_1white.png" class="img-thumbnail1" style="border:none"></td>
                                    <td>
                                        <p style="color:#fff">
                                            ` + response.data.result.summary.shipper_name + `<br\>
                                            ` + response.data.result.summary.origin + `
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:42px"><img src="asset_resi/box_2white.png" class="img-thumbnail1" style="border:none"></td>
                                    <td>
                                        <p style="color:#fff">
                                            ` + response.data.result.summary.receiver_name + `<br\>
                                            ` + response.data.result.summary.destination + `
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-12 col-sm-12 col-xs-12" style="margin-top: 5px; background:#fff; border-radius:10px; box-shadow:0px 1px 4px 0px #ccc; padding:20px">
                            <p>
                                <img src="https://s3-ap-southeast-1.amazonaws.com/sahitotest/assets/carriers/` + courier_image + `" class="img-thumbnail2"/>
                            </p>
                            
                            <p>
                                ` + response.data.query.waybill + `<br\>
                                Last Info :` + response.data.result.summary.status + `<br\>
                            </p>
                        </div>
                    </div>
                    <p>&nbsp;</p>
                    <div class="col-md-12 col-sm-12 col-xs-12"">
                        <!-- MANIFEST TIMELINE goes here -->
                        <ul class="timeline">
                            <li class="timeline-item"></li>
                        </ul>
                    </div>
                </div>
            `;
                if (response.data.result.manifest !== null || response.data.result.manifest !== undefined) {
                    if (response.data.result.manifest.length > 0) {
                        resultHtml.append(table);

                        for (var j = 0; j < response.data.result.manifest.length; j++) {
                            $('.timeline > li:last-child').append(`
                                <li class="timeline-item">
                                    <div class="timeline-badge success"><i class="glyphicon glyphicon-ok"></i></div>
                                        <div class="timeline-panel">
                                            <div class="timeline-heading">
                                                <p><small><i class="glyphicon glyphicon-time"></i>` + response.data.result.manifest[j].manifest_date + `<br\>` + response.data.result.manifest[j].manifest_time + `</small></p>
                                            </div>
                                            <div class="timeline-body">
                                                <p>` + response.data.result.manifest[j].manifest_description + `</p>
                                            </div>
                                        </div>
                                    </li>`
                            );
                        }
                    }
                    else {
                        $('#resi-results').empty();
                        resultHtml.append('<p style="text-align: center">Hasil pencarian tidak ditemukan..</p>');
                    }
                }
                $(':button[type="submit"]').prop('disabled', false);

            }
        });
    }

    function formatCurrency(total) {

        var dot = ".";
        var value = new String(total);
        var decimal = [];
        while (value.length > 3) {
            var asd = value.substr(value.length - 3);
            decimal.unshift(asd);
            value = value.substr(0, value.length - 3);
        }

        if (value.length > 0) {
            decimal.unshift(value);
        }
        value = decimal.join(dot);
        return value;

    }

    function main() {
        jQuery(document).ready(function ($) {
            init($);
        });
    }

})();


