$(function() {
    var tbtc_thegraph = address.tbtc_thegraph;
    var etherTxAddres = address.etherTxAddres;
    var etherWalletAdress = address.etherWalletAdress;
    var index = {
        init: function() {
            var that = this;
            this.getCirculation();
            this.getTxsInfo();
            this.getTopHolders();
            this.getBondedTransaction();
            this.getMintTransaction();
        },
        getTxsInfo: function() {
            var that = this;
            var param = '{"query":"{ \
                           transfers(first: 10, orderBy: timestamp, orderDirection: desc) { \
                             id         \
                             value      \
                             from       \
                           } \
                          } ","variables":null}';
            $.ajax({
                type: "POST",
                url: `${tbtc_thegraph}`,
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
                                                <p class="total-price">Amount ${parseFloat(value).toFixed(7)} tBTC</p>
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
                url: `${tbtc_thegraph}`,
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
                                var balance = addCommas(parseFloat(tokenHolders[i].tokenBalance).toFixed(7));
                                var percent = parseFloat(tokenHolders[i].tokenBalance) / 1000000000 * 100;
                                percent = percent.toFixed(5);
                                txnsStr += `<div class="profile-post">
                                            <div class="data-formats-post pull-left">
                                              <img src="assets/img/wallet.png" alt="">
                                            </div>
                                            <div class="block-detail-post pull-left">
                                              <div class="trans-hash">Wallet# <a target="_blank" href="${etherWalletAdress}${wallet}" class="to-trans-hash">${wallet}</a></div>
                                                <span class="p-to-p">Balance <span class="balance">${balance} tBTC</span></span>
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
        getMintTransaction: function() {
            var that = this;
            var param = '{"query":"{ \
                            mints (first:20,orderBy:timestamp,orderDirection:desc){ \
                                id     \
                                amount \
                                to     \
                            }}","variables":null}';
            $.ajax({
                type: "POST",
                url: `${tbtc_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var txnsData = res.data.mints;
                        var txnsStr = '';
                        if (txnsData != null) {
                            var txHashShowed = new Array();
                            for (var i = 0; i < txnsData.length; i++) {
                                var value = txnsData[i].value;
                                if (value === '') {
                                    value = '0'
                                }
                                var txHash = txnsData[i].id.substring(0, txnsData[i].id.indexOf("-"));
                                if (txHashShowed.includes(txHash)) {
                                    continue;
                                }
                                txHashShowed.push(txHash);
                                var to = txnsData[i].to;
                                var value = addCommas(txnsData[i].amount);
                                txnsStr += `<div class="profile-post">
                                              <div class="data-formats-post pull-left">
                                                <img src="assets/img/transaction.png" alt="">
                                              </div>
                                              <div class="block-detail-post pull-left">
                                                <div class="trans-hash">TX# <a target="_blank" href="${etherTxAddres}${txHash}" class="to-trans-hash">${txHash}</a></div>
                                                  <p class="p-to-p">To <a target="_blank" href="${etherWalletAdress}${to}">${to}</a></p>
                                                <p class="total-price">Amount ${parseFloat(value).toFixed(7)} tBTC</p>
                                              </div>
                                             </div>`
                            }
                            $('#mint_transaction').html(txnsStr);
                        }
                    }
                },
                error: function(error) {
                    console.info(error.statusText);
                }
            });
        },
        getBondedTransaction: function() {
            var that = this;
            var param = '{"query":"{    \
                            bondedECDSAKeeps(first:10,orderBy:timestamp,orderDirection:desc){\
                                transaction{\
                                    id\
                                }\
                                keepAddress\
                                bondAmount\
                                state\
                            } \
                        }","variables":null}';
            $.ajax({
                type: "POST",
                url: `${tbtc_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        var bondedECDSAKeeps = res.data.bondedECDSAKeeps;
                        var txnsStr = '';
                        var totalStaking = parseFloat(res.data.bondedECDSAKeeps[0].totalTokenStaking);
                        if (bondedECDSAKeeps != null) {
                            for (var i = 0; i < bondedECDSAKeeps.length; i++) {
                                var amount = parseFloat(bondedECDSAKeeps[i].bondAmount);
                                var wallet = bondedECDSAKeeps[i].keepAddress;
                                var state = bondedECDSAKeeps[i].state;
                                var txHash = bondedECDSAKeeps[i].transaction.id;

                                txnsStr += `<div class="profile-post">
                                                <div class="data-formats-post pull-left">
                                                    <img src="assets/img/transaction.png" alt="">
                                                </div>
                                                <div class="block-detail-post pull-left">
                                                <div class="trans-hash">TX# <a target="_blank" href="${etherTxAddres}${txHash}" class="to-trans-hash">${txHash}</a></div>
                                                    <p class="p-to-p">To <a target="_blank" href="${etherWalletAdress}${wallet}">${wallet}</a></p>
                                                <p class="total-price">Amount ${parseFloat(amount).toFixed(7)} ETH</p>
                                                <p class="total-price">State ${state} </p>
                                                </div>
                                            </div>`
                            }
                            $('#bonded_transaction').html(txnsStr);
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
                url: `${tbtc_thegraph}`,
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
            var param = '{"query":"{        \
                              tbtctokens{   \
                                symbol      \
                                address     \
                                decimals    \
                                totalSupply \
                                maxSupply   \
                                totalBurn   \
                                totalMint   \
                             } \
                             totalBondedECDSAKeeps{ \
                                totalAmount \
                              } \
                        }","variables":null}';
            $.ajax({
                type: "POST",
                url: `${tbtc_thegraph}`,
                contentType: "application/json; charset=utf-8",
                data: param,
                success: function(res) {
                    if (res != null) {
                        console.log(res);

                        var tbtctokens = res.data.tbtctokens[0];
                        var totalBondedECDSAKeeps = res.data.totalBondedECDSAKeeps[0];
                        if (tbtctokens != null) {
                            $('#tbtc_symbol').html(tbtctokens.symbol);
                            $('#tbtc_contract').html(tbtctokens.address);
                            $('#tbtc_decimals').html(tbtctokens.decimals);
                            $('#tbtc_max_supply').html(addCommas(tbtctokens.maxSupply) + " tBTC");
                            $('#tbtc_current_circulation').html(addCommas(tbtctokens.totalSupply) + " tBTC");
                            $('#tbtc_total_mint').html(addCommas(tbtctokens.totalMint) + " tBTC");
                            $('#tbtc_total_burn').html(addCommas(tbtctokens.totalBurn) + " tBTC");
                            $('#tbtc_total_bonded').html(addCommas(addCommas(totalBondedECDSAKeeps.totalAmount)) + " ETH");

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