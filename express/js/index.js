$(function() {
    var cUrl = address.testUrl;
    var index = {
        init: function() {
            var that = this;
            this.getBlockInfo();
            this.getTxsInfo();
            this.getCount();
            this.getChartData();
            this.getCirculation();


        },
        getBlockInfo: function() {
            var that = this;
            var param = {
                biz: {
                    miner: ''
                },
                page: {
                    page_no: 1,
                    page_size: 10,
                }
            }
            $.ajax({
                type: "POST",
                url: `${cUrl}/blocks`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        var blockData = res.biz.blocks;
                        var blockStr = '';
                        if (blockData == null) {

                        } else {
                            for (var i = 0; i < blockData.length; i++) {
                                var timestamp = that.toTen(blockData[i].timestamp);
                                var date = that.timestampToTime(timestamp);
                                var trans = blockData[i].transactions;
                                var tansStr = ''
                                if (trans.length > 0) {
                                    tansStr = `<a href="txs.html?blockHash=${blockData[i].hash}" class="trans-num">${trans.length} txns</a>`
                                } else {
                                    tansStr = '0 txns'
                                }
                                blockStr += `<div class="profile-event">
                              <div class="data-formats pull-left">
                                <div style="font-size:12px; height:28px;line-height:28px;"><a href="blockInfo.html?hash=${blockData[i].hash}" style="color:#fff;">Block ${that.toTen(blockData[i].number)}</a></div>
                                <div style="font-size:10px;">${date}</div>
                              </div>
                              <div class="block-detail pull-left">
                                <span>Mined By <a href="accountInfo.html?hash=${blockData[i].miner}&miner=true" class="minerBy">${blockData[i].miner}</a></span>
                                <div>${tansStr} in this block</div>
                              </div>
                            </div>`
                            }
                        }
                        $('.list-body-left').html(blockStr);
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
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
                              <img src="assets/img/icon.png" alt="">
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
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
            $.ajax({
                type: "POST",
                url: `${cUrl}/tx/count`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        $('.transCount').html(res.biz.txCount)
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
            $.ajax({
                type: "POST",
                url: `${cUrl}/tokens/count`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        $('.tokensCount').html(res.biz.tokenCount)
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
        },
        cartogram: function(showDate, totalArr) {
            var myChart = echarts.init(document.getElementById('main'));
            var option = {
                title: {
                    text: '15 day KEEP Transaction History'
                },
                tooltip: {
                    trigger: 'axis'
                },
                itemStyle: {
                    color: '#3498db'
                },
                lineStyle: {
                    color: '#3498db'
                },
                xAxis: {
                    type: 'category',
                    data: showDate
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: totalArr,
                    type: 'line'
                }]
            };
            myChart.setOption(option);
        },
        getChartData: function() {
            var that = this;
            var timestamp = new Date().getTime();
            var timestamp1 = timestamp - 14 * 24 * 60 * 60 * 1000;
            var newEnd = timestamp + 1 * 24 * 60 * 60 * 1000;
            var dateEnd = this.timeToYmd(newEnd);
            var dateStart = this.timeToYmd(timestamp1);
            var param = {
                biz: {
                    beginDate: dateStart,
                    endDate: dateEnd
                }
            }
            $.ajax({
                type: "POST",
                url: `${cUrl}/tx/chart`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        var datasArr = res.biz.datas;
                        var showDate = [];
                        var forDate = [];
                        var totalArr = [];
                        for (var i = 14; i >= 0; i--) {
                            var time = timestamp - i * 24 * 60 * 60 * 1000;
                            showDate.push(that.toShowDate(time));
                            forDate.push(that.timeToYmd(time));
                        }
                        for (var m = 0; m < forDate.length; m++) {
                            var ex = false
                            if (datasArr === null || datasArr.length === 0) {
                                totalArr.push(0);
                                ex = true
                                continue;
                            }
                            for (var n = 0; n < datasArr.length; n++) {
                                if (forDate[m] == datasArr[n].id) {
                                    totalArr.push(datasArr[n].total);
                                    ex = true
                                    break;
                                }
                            }
                            if (!ex) {
                                totalArr.push(0);
                            }
                        }
                        that.cartogram(showDate, totalArr)
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        toShowDate: function(timestamp) {
            var date = new Date(timestamp);
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
            var D = date.getDate();
            return M + D;
        },
        timeToYmd: function(timestamp) {
            var date = new Date(timestamp);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            return Y + M + D;
        },
        toTen: function(str) {
            var num = str;
            return parseInt(num, 16);
        },

        timestampToTime: function(timestamp) {
            var date = new Date(timestamp * 1000);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = date.getSeconds();
            if (s * 1 < 10) {
                s = '0' + s;
            }
            return Y + M + D + h + m + s;
        }
    }
    index.init();

    function autoRefresh() {
        index.init();
    }
    setInterval(autoRefresh, 30 * 1000);
})