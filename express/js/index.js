$(function() {
    var cUrl = address.testUrl;
    var index = {
        init: function() {
            var that = this;
            this.getTxsInfo();
            this.getCount();
            this.getCirculation();
        },
        getTxsInfo: function() {
            var that = this;
            var param = {
                biz: {

                },
                page: {
                    page_no: 1,
                    page_size: 10,
                }
            }
            $.ajax({
                type: "POST",
                url: `${cUrl}/transactions`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        var txnsData = res.biz.transactions;
                        var txnsStr = '';
                        if (txnsData == null) {

                        } else {
                            for (var i = 0; i < txnsData.length; i++) {
                                var value = txnsData[i].value;
                                if (value === '') {
                                    value = '0'
                                }
                                txnsStr += `<div class="profile-post">
                            <div class="data-formats-post pull-left">
                              <img src="assets/img/transaction.png" alt="">
                            </div>
                            <div class="block-detail-post pull-left">
                              <div class="trans-hash">TX# <a href="txsInfo.html?hash=${txnsData[i].hash}" class="to-trans-hash">${txnsData[i].hash}</a></div>
                              <p class="p-to-p">From <a href="accountInfo.html?hash=${txnsData[i].from}&miner=false">${txnsData[i].from}</a></p>
                              <p class="total-price">Amount ${value} SERO</p>
                            </div>
                          </div>`
                            }
                            $('.list-body-right').html(txnsStr);
                        }
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getCount: function() {
            var param = {
                biz: {

                }
            }
            $.ajax({
                type: "POST",
                url: `${cUrl}/block/count`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        $('.blockCount').html(res.biz.blockCount)
                        $('.transCount').html(res.biz.blockCount)
                        $('.tokensCount').html(res.biz.blockCount)
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getCirculation: function() {
            var param = {
                biz: {

                }
            }
            $.ajax({
                type: "POST",
                url: `${cUrl}/circulation`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    $('.pcirculation').html(res.planned_circulation)
                    $('.circulation').html(res.actual_circulation)
                    var burned = res.planned_circulation - res.actual_circulation;
                    $('.burned').html(burned)

                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        }
    }
    index.init();

    function autoRefresh() {
        index.init();
    }
    setInterval(autoRefresh, 30 * 1000);
})