(function () {

    'use strict';

    let jQuery;
    // let baseUrl = "https://development.zuragan.com/api/v1/pub";
    let baseUrl = "https://ongkir.zuragan.com/api/v1";
    // let baseUrl = "https://api.zuragan.com/api/v1/pub";
    // let baseUrl = "localhost:9292/api/v1/pub";

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

        generateForm($);


        $('#zuragan-ongkir-form').submit(function (event) {
            event.preventDefault();
            let $inputs = $('#zuragan-ongkir-form :input');
            // getShippingCost($, $inputs);
            getShippingCosts($, $inputs);

        });

    }

    function generateForm($) {
        const widgetForm = `
        <!--<div align="center"><img src="ongkir/zurong.png" class="img-thumbnail3"></div>-->
        <form class="form-inline text-center" id="zuragan-ongkir-form" style="display: inline-block">
            <!--<div class="container-fluid">-->
                <!--<div class="row pt-0 pb-0">-->
                    <!--<div class="col-md-12 col-sm-12 col-xs-12">-->
                        <!--<div class="col-md-12 col-sm-12 col-xs-12" style="margin-top: 25px; background:#fff; border-radius:10px; box-shadow:0px 1px 4px 0px #ccc; padding:20px; overflow: auto" id="form-main">-->
                            <p>&nbsp;</p>
                            <div class="col-md-12 col-sm-12 col-xs-12 align-center" style="padding: 10px;">
                                <div class="col-md-2 col-sm-2 col-xs-2">
                                    <label for="zuragan-weight">
                                        <img src="asset_ongkir/weight_active.png" class="img-thumbnail1">
                                    </label>
                                </div>
                                <div class="col-md-10 col-sm-10 col-xs-10">
                                    <input style="width: 100%; position: static" type="number" value="1000" name="ongkir_weight" min="0" class="form-control" id="zuragan-ongkir-weight" placeholder="1000 g" required/>
                                </div>
                            </div>
                            <div class="col-md-12 col-sm-12 col-xs-12 align-center" style="padding: 10px">
                                <div class="col-md-2 col-sm-2 col-xs-2">
                                    <label for="zuragan-city-from">
                                        <img src="asset_ongkir/boxOpen_active.png" class="img-thumbnail1">
                                    </label>
                                </div>
                                <div class="col-md-10 col-sm-10 col-xs-10">
                                    <input data-provide="typeahead" autocomplete="off" type="text" name="ongkir_origin" class="form-control" id="zuragan-ongkir-from" placeholder="Kota Asal" required style="width:100%; position: static"/>
                                </div>
                            </div>
                            <div class="col-md-12 col-sm-12 col-xs-12 align-center" style="padding: 10px">
                                <div class="col-md-2 col-sm-2 col-xs-2">
                                    <label for="zuragan-city-destination">
                                        <img src="asset_ongkir/boxClose_active.png" class="img-thumbnail1">
                                    </label>
                                </div>
                                <div class="col-md-10 col-sm-10 col-xs-10">
                                    <input data-provide="typeahead" autocomplete="off" type="text" name="ongkir_destination" class="form-control" id="zuragan-ongkir-destination" placeholder="Kota Tujuan" required style="width:100%; position: static"/>
                                </div>
                            </div>
                            <p>&nbsp;</p>
                            <div>
                                <button type="submit" class="btn btn-primary" style="background-color: #FF5900; height: 40px; width: 200px">
                                    Cek
                                </button>
                            </div>
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </form>
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
        <!--<p>&nbsp;</p>-->
      <div id="ongkir-results" style="padding: 0px 10px"></div>
    `;

        $("#zuragan-ongkir-widget").append($(widgetForm));

        searchCity($, "#zuragan-ongkir-from");
        searchSubdistrict($, "#zuragan-ongkir-destination");
        // setCarriersData($);
    }

    function setCarriersData() {
        $.ajax({
            url: baseUrl + "/carriers",
            dataType: "JSON",
            type: "GET",
            async: true,
            success: function (response) {
                // let carriersForm = $('#zuragan-carrier');
                // carriersForm.empty();
                $.each(response.data.data, function (key, value) {
                    // carriersForm.append('<option value=' + value['code'] + '>' + value['name'] + '</option>');
                    carriersForm.append(value = +value['code'] + '>' + value['logo']);
                });
            }
        });
    }

    function searchCity($, tag) {
        $(tag)
            .typeahead({
                fitToElement: true,
                minLength: 1,
                scrollHeight: 5,
                displayText: function (item) {
                    return item.full_name;
                },
                items: 15,
                delay: 400,
                source: function (query, process) {
                    $.ajax({
                        url: baseUrl + "/cities",
                        data: 'min_char=3&type=city&q=' + query,
                        dataType: "JSON",
                        type: "GET",
                        async: true,
                        success: function (response) {
                            process(response.data);
                        }
                    });
                },
                updater: function (item) {
                    $(tag).attr('data-id', item.id);
                    $(tag).attr('data-type', item.type);

                    return item.full_name;
                }
            });
    }

    function searchSubdistrict($, tag) {
        $(tag)
            .typeahead({
                fitToElement: true,
                minLength: 1,
                scrollHeight: 5,
                displayText: function (item) {
                    return item.full_name;
                },
                items: 15,
                delay: 400,
                source: function (query, process) {
                    $.ajax({
                        url: baseUrl + "/cities",
                        data: 'min_char=3&q=' + query,
                        dataType: "JSON",
                        type: "GET",
                        async: true,
                        success: function (response) {
                            process(response.data);
                        }
                    });
                },
                updater: function (item) {
                    $(tag).attr('data-id', item.id);
                    $(tag).attr('data-type', item.type);

                    return item.full_name;
                }
            });
    }

    function getShippingCost($, $inputs) {
        $('#ongkir-results').empty();
        $(':button[type="submit"]').prop('disabled', false);

        let data = {};
        let values = {};

        $inputs.each(function () {
            values[this.name] = {
                value: $(this).val(),
                id: $(this).attr('data-id'),
                type: $(this).attr('data-type')
            };
        });

        data.origin = values.ongkir_origin.id;
        data.originType = values.ongkir_origin.type;
        data.destination = values.ongkir_destination.id;
        data.destinationType = values.ongkir_destination.type;
        data.weight = values.ongkir_weight.value;
        // data.courier = setCarriersData().value;
        data.courier = "jne:pos:tiki:wahana:jnt:pandu:sicepat";
        data.length = 0;
        data.width = 0;
        data.height = 0;

        $.ajax({
            url: baseUrl + "/ongkir/domestic-costs",
            data: data,
            dataType: "JSON",
            type: "POST",
            async: true,
            success: function (response) {
                let resultHtml = $('#ongkir-results');
                let table = `
            <table class="ongkir-result-table table table-responsive" align="center" style="display: inline-block">
              <thead>
                <tr>
                  <th style="text-align: left">KURIR</th>
                  <th style="text-align: left">LAYANAN</th>
                  <th style="text-align:left">TARIF</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
            `;

                if (response.data.data !== null || response.data.data !== undefined) {
                    if (response.data.results.length > 0) {
                        resultHtml.append(table);

                        for (var i = 0; i < response.data.results.length; i++) {
                            var courier_image;
                            var num_layanan;
                            var num_row;
                            switch (response.data.results[i].code) {
                                case "jne":
                                    courier_image = "jne_id_xs.png";
                                    break;
                                case "pos":
                                    courier_image = "pos_id_xs.png";
                                    break;
                                case "tiki":
                                    courier_image = "tiki_id_xs.png";
                                    break;
                                case "wahana":
                                    courier_image = "wahana_id_xs.png";
                                    break;
                                case "J&T":
                                    courier_image = "jnt_id_xs.png";
                                    break;
                                case "pandu":
                                    courier_image = "pandu_id_xs.png";
                                    break;
                                case "sicepat":
                                    courier_image = "sicepat_id_xs.png";
                                    break;
                            }
                            $.each(response.data.results[i].costs, function (j, data) {
                                $('.ongkir-result-table > tbody:last-child').append(`
                                        <tr>
                                            <td><img src="https://s3-ap-southeast-1.amazonaws.com/sahitotest/assets/carriers/` + courier_image + `" class="img-thumbnail2"/></td>
                                            <td style="text-align: left; vertical-align:middle">` + data.service + ` ` + data.cost[0].etd + `</td>
                                            <td style="color: blue; font-size: large; vertical-align:middle; text-align:left"><sup style="color:#4d4d4d">Rp. </sup><b>` + formatCurrency(data.cost[0].value.toFixed(0)) + `</b></td>
                                        </tr>`
                                );
                            });

                        }
                    } else {
                        $('#ongkir-results').empty();
                        resultHtml.append('<p style="text-align: center">Hasil pencarian tidak ditemukan..</p>');
                    }
                }

                $(':button[type="submit"]').prop('disabled', false);

            }
        });
    }

    function getShippingCosts($, $inputs) {
        $('#ongkir-results').empty();
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

        data.origin = values.ongkir_origin.id;
        data.originType = values.ongkir_origin.type;
        data.destination = values.ongkir_destination.id;
        data.destinationType = values.ongkir_destination.type;
        data.weight = values.ongkir_weight.value;
        // data.courier = setCarriersData().value;
        data.courier = "jne:pos:tiki:wahana:jnt:pandu:sicepat";
        data.length = 0;
        data.width = 0;
        data.height = 0;


        $.ajax({
            url: baseUrl + "/ongkir/domestic-costs?sort=asc",
            data: data,
            dataType: "JSON",
            type: "POST",
            async: true,
            success: function (response) {
                let resultHtml = $('#ongkir-results');
                let table = `
            <br/>
            <!--<div class="container col-md-12 col-sm-12 col-xs-12" style="border-radius: 10px; box-shadow: 0px 1px 4px 0px #ccc;">-->
                <!--<div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center;">-->
                    <!--<h4>KURIR</h4>-->
                <!--</div>-->
                <!--<div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center;">-->
                    <!--<h4>LAYANAN</h4>-->
                <!--</div>-->
                <!--<div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center;">-->
                    <!--<h4>TARIF</h4>-->
                <!--</div>-->
            <!--</div>-->
            <div class="ongkir-result-table">
                <div>
                </div>
            </div>
            <!--<table class="ongkir-result-table table table-responsive" align="center">-->
              <!--<thead>-->
                <!--<tr>-->
                  <!--<th style="height:60px; vertical-align:middle; font-size:large">KURIR</th>-->
                  <!--<th style="text-align: left; height:60px; vertical-align:middle; font-size:large">LAYANAN</th>-->
                  <!--<th style="text-align:left; height:60px; vertical-align:middle; font-size:large">TARIF</th>-->
                <!--</tr>-->
              <!--</thead>-->
              <!--<tbody>-->
              <!--</tbody>-->
            <!--</table>-->
            `;

                if (response.data.data !== null || response.data.data !== undefined) {
                    if (response.data.results.length > 0) {
                        resultHtml.append(table);

                        for (var j = 0; j < response.data.results.length; j++) {
                            var courier_image;
                            switch (response.data.results[j].code) {
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
                                case "J&T":
                                    courier_image = "jnt_id.png";
                                    break;
                                case "pandu":
                                    courier_image = "pandu.png";
                                    break;
                                case "sicepat":
                                    courier_image = "sicepat_id.png";
                                    break;
                            }
                            $('.ongkir-result-table > div:last-child').append(`
                                <div style="border-radius: 10px; box-shadow: 0px 1px 4px 0px #ccc; padding: 5px; margin-bottom: 10px;">
                                    <div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center !important; padding-top: 15px;">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/sahitotest/assets/carriers/` + courier_image + `" class="img-thumbnail2"/>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center; padding-top: 15px;">
                                        ` + response.data.results[j].service + ` <br/> ` + response.data.results[j].etd + `
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center; color: blue; font-size: large; padding-top: 15px;">
                                        <sup style="color:#4d4d4d">Rp. </sup><b>` + formatCurrency(response.data.results[j].value.toFixed(0)) + `</b>
                                    </div>
                                    <p>&nbsp;</p>
                                </div>
                                `
                            );
                        }
                    } else {
                        $('#ongkir-results').empty();
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



