$(function() {
    var cUrl = address.testUrl;
    var common = {
        init: function() {
            this.insertNav();
            this.insertFooter();
        },
        insertNav: function() {
            var that = this;
            // '<li class="nav-item" role="presentation"><a class="nav-link" href="accounts.html">ACCOUNT</a></li>'+
            var commonNavStr = '<nav class="navbar navbar-light navbar-expand-lg fixed-top bg-white clean-navbar">' +
                '<div class="container">' +
                '<a class="navbar-brand logo" href="index.html" style="font-family:' + "'Nova Flat'" + ', cursive;font-weight:normal;font-style:normal;">' +
                '<img src="assets/img/logo.png">&nbsp; KEEP' +
                '</a>' +
                '<button class="navbar-toggler" data-toggle="collapse" data-target="#navcol-1">' +
                '<span class="sr-only">Toggle navigation</span>' +
                '<span class="navbar-toggler-icon"></span>' +
                '</button>' +
                '<div class="collapse navbar-collapse" id="navcol-1">' +
                '<ul class="nav navbar-nav ml-auto changeActive">' +
                '<li class="nav-item" role="presentation">' +
                '<a class="nav-link text-monospace" href="index.html" style="font-family:Montserrat, sans-serif;">tBTC</a>' +
                '</li>' +
                '</ul>' +
                '<form class="navbar-form navbar-left" role="search">' +
                '<div class="form-group">' +
                '<input type="text" class="form-control" placeholder="Txhash / Block / Token">' +
                '</div><button class="btn btn-default searchBtn">GO</button>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '</nav>'
            $('.navContent').append(commonNavStr);
            var path = window.location.pathname;
            if (path.indexOf('index') > -1) {
                $('.changeActive li').eq(0).addClass('active');
            } else if (path.indexOf('account') > -1) {
                $('.changeActive li').eq(2).addClass('active');
            } else {
                $('.changeActive li').eq(1).addClass('active');
            }
            $('.searchBtn').on('click', function(event) {
                event.preventDefault();
                var hash = $('.form-control').val()
                that.searchByHash(hash);
            })
            $('.form-control').keyup(function(e) {
                if (e.keyCode == 13) {
                    var hash1 = $('.form-control').val()
                    that.searchByHash(hash1);
                }
            })
        },
        searchByHash: function(hash) {
            var that = this;
            if (hash != '') {
                if (hash.length == 88) {
                    window.location.href = 'txs.html?constractAd=' + hash
                } else {
                    if (hash.length == 66) {
                        var param = {
                            biz: {
                                txHash: hash,
                            }
                        }
                        $.ajax({
                            type: "POST",
                            url: `${cUrl}/transaction`,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(param),
                            success: function(res) {
                                if (res.base.code === 'SUCCESS') {
                                    window.location.href = 'txsInfo.html?hash=' + hash
                                } else {
                                    var param1 = {
                                        biz: {
                                            blockHash: hash,
                                        }
                                    }
                                    $.ajax({
                                        type: "POST",
                                        url: `${cUrl}/block`,
                                        dataType: "json",
                                        contentType: "application/json; charset=utf-8",
                                        data: JSON.stringify(param1),
                                        success: function(res) {
                                            if (res.base.code === 'SUCCESS') {
                                                window.location.href = 'blockInfo.html?hash=' + hash
                                            }
                                        },
                                        error: function(error) {
                                            console.info(error.statusText);
                                        }
                                    });
                                }
                            },
                            error: function(error) {
                                console.info(error.statusText);
                            }
                        });
                    }
                }
            }
        },
        insertFooter: function() {
            var footerStr = '<div class="footer-copyright">' +
                '<a href="https://chat.tbtc.network/" target="_blank">KEEP Network Discord</a>' +
                '<p>@ 2020 Contributed by SunTzu#1022</p>' +
                '</div>'
            $('.footer-content').append(footerStr);
        },
        timestampToTime: function(timestamp) {
            var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            if (s * 1 < 10) {
                s = '0' + s;
            }
            return Y + M + D + h + m + s;
        }
    }
    common.init();
})