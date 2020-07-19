$(function() {
    var keep_thegraph = address.keep_thegraph;
    var etherTxAddres = address.etherTxAddres;
    var etherWalletAdress = address.etherWalletAdress;
    var index = {
        init: function() {
            var that = this;
            this.getCirculation();
            this.getTxsInfo();
            this.getTopHolders();
            this.getTxsStaking();
            this.getTopStaking();
        },
        getTxsInfo: function() {
            var that = this;
            var param = '{"query":"{ \
                           transfers(first: 10, orderBy: timestamp, orderDirection: desc) { \
                             id         \
                             timestamp  \
                             value      \
                             from       \
                           } \
                          } ","variables":null}';
            $.ajax({
                type: "POST",
                url: `${keep_thegraph}`,
                contentType: "application/json",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var txnsData = res.data.transfers;
                        var txnsStr = '';
                        if (txnsData != null) {
                            for (var i = 0; i < txnsData.length; i++) {
                                var value = txnsData[i].value;
                                if (value === '') {
                                    value = '0'
                                }
                                var txHash = txnsData[i].id;
                                var fromAdds = txnsData[i].from;
                                txnsStr += `<div class="profile-post">
                                              <div class="data-formats-post pull-left">
                                                <img src="assets/img/transaction.png" alt="">
                                              </div>
                                              <div class="block-detail-post pull-left">
                                                <div class="trans-hash">TX# <a target="_blank" href="${etherTxAddres}${txHash}" class="to-trans-hash">${txHash}</a></div>
                                                  <p class="p-to-p">From <a target="_blank" href="${etherWalletAdress}${fromAdds}">${fromAdds}</a></p>
                                                <p class="total-price">Amount ${parseFloat(value).toFixed(2)} KEEP</p>
                                              </div>
                                             </div>`
                            }
                            $('#transaction').html(txnsStr);
                        }
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getTopHolders: function() {
            var that = this;
            var param = '{"query":"{    \
                            tokenHolders(first: 10, orderBy: tokenBalanceRaw, orderDirection: desc) {\
                              id              \
                              tokenBalance    \
                            }               \
                            }","variables":null}';
            $.ajax({
                type: "POST",
                url: `${keep_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var tokenHolders = res.data.tokenHolders;
                        var txnsStr = '';
                        if (tokenHolders != null) {
                            for (var i = 0; i < tokenHolders.length; i++) {
                                var value = tokenHolders[i].value;
                                if (value === '') {
                                    value = '0'
                                }
                                var wallet = tokenHolders[i].id;
                                var balance = addCommas(parseFloat(tokenHolders[i].tokenBalance).toFixed(1));
                                var percent = parseFloat(tokenHolders[i].tokenBalance) / 1000000000 * 100;
                                percent = percent.toFixed(5);
                                txnsStr += `<div class="profile-post">
                                            <div class="data-formats-post pull-left">
                                              <img src="assets/img/wallet.png" alt="">
                                            </div>
                                            <div class="block-detail-post pull-left">
                                              <div class="trans-hash">Wallet# <a target="_blank" href="${etherWalletAdress}${wallet}" class="to-trans-hash">${wallet}</a></div>
                                                <span class="p-to-p">Balance <span class="balance">${balance} KEEP</span></span>
                                                <br><span class="total-price">Percent <span class="balance">${percent} %</span></span>
                                            </div>
                                           </div>`
                            }
                            $('#top_holder').html(txnsStr);
                        }
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getTxsStaking: function() {
            var that = this;
            var param = '{"query":"{  \
                            transactionStakings (first:10,where:{transactionType:STAKED}, orderBy:timestamp,orderDirection:desc){\
                                id,     \
                                from,   \
                                to,     \
                                value   \
                            }}","variables":null}';
            $.ajax({
                type: "POST",
                url: `${keep_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var txnsData = res.data.transactionStakings;
                        var txnsStr = '';
                        if (txnsData == null) {

                        } else {
                            for (var i = 0; i < txnsData.length; i++) {
                                var value = txnsData[i].value;
                                if (value === '') {
                                    value = '0'
                                }
                                var txHash = txnsData[i].id;
                                var from = txnsData[i].from;
                                var value = addCommas(txnsData[i].value);
                                txnsStr += `<div class="profile-post">
                                          <div class="data-formats-post pull-left">
                                            <img src="assets/img/transaction.png" alt="">
                                          </div>
                                          <div class="block-detail-post pull-left">
                                            <div class="trans-hash">TX# <a target="_blank" href="${etherTxAddres}${txHash}" class="to-trans-hash">${txHash}</a></div>
                                              <p class="p-to-p">From <a target="_blank" href="${etherWalletAdress}${from}&miner=false">${from}</a></p>
                                            <p class="total-price">Amount ${value} KEEP</p>
                                          </div>
                                         </div>`
                            }
                            $('#staking_transaction').html(txnsStr);
                        }
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getTopStaking: function() {
            var that = this;
            var param = '{"query":"{\
                            tokenStakings{ \
                                totalTokenStaking \
                            } \
                            members(first: 10, where: {stakingState: STAKED},orderBy:amount,orderDirection:desc) {\
                                    id  \
                                    amount\
                            }}","variables":null}';
            $.ajax({
                type: "POST",
                url: `${keep_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var members = res.data.members;
                        var txnsStr = '';
                        var totalStaking = parseFloat(res.data.tokenStakings[0].totalTokenStaking);
                        if (members != null) {
                            for (var i = 0; i < members.length; i++) {
                                var amount = parseFloat(members[i].amount);
                                var wallet = members[i].id;
                                var percent = amount / totalStaking * 100;

                                txnsStr += `<div class="profile-post">
                                        <div class="data-formats-post pull-left">
                                          <img src="assets/img/wallet.png" alt="">
                                        </div>
                                        <div class="block-detail-post pull-left">
                                              <div class="trans-hash">Wallet# <a target="_blank" href="${etherWalletAdress}${wallet}" class="to-trans-hash">${wallet}</a></div>
                                                <span class="p-to-p">Balance <span class="balance">${amount} KEEP</span></span>
                                                <br><span class="total-price">Percent <span class="balance">${percent.toFixed(2)} %</span></span>
                                        </div>
                                       </div>`
                            }
                            $('#staking_top').html(txnsStr);
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
                url: `${keep_thegraph}`,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                success: function(res) {
                    if (res.base.code === 'SUCCESS') {
                        $('#symbol').html(res.biz.blockCount)
                        $('#contract').html(res.biz.blockCount)
                        $('#decimasl').html(res.biz.blockCount)
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getCirculation: function() {
            var param = '{"query":"{ \
                            governances{ \
                                symbol,  \
                                maxSupply, \
                                contractAddress,\
                                decimals\
                            }\
                            tokenStakings{\
                                totalTokenStaking \
                            }}","variables":null\
                        }';
            $.ajax({
                type: "POST",
                url: `${keep_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var governances = res.data.governances[0];
                        var tokenStakings = res.data.tokenStakings[0];
                        if (governances != null) {
                            $('#symbol').html(governances.symbol);
                            $('#contract').html(governances.contractAddress);
                            $('#decimals').html(governances.decimals);
                            $('#max_supply').html(addCommas(governances.maxSupply));
                        }
                        if (tokenStakings != null) {
                            $('#total_staking').html(addCommas(tokenStakings.totalTokenStaking));
                        }
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        }
    }

    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    index.init();

    function autoRefresh() {
        index.init();
    }
    setInterval(autoRefresh, 30 * 1000);
})