
const script = document.createElement('script');
script.src = 'https://s3.tradingview.com/tv.js';
script.async = true;
document.body.appendChild(script);

script.onload = () => {
    // To update the prices of the trading pairs in the Start Trading selection (but doesn't work for now)
    async function getLatestPrice(tradingPair) {
        try {
            const coin = tradingPair.split(':')[1].slice(0, -3).toLowerCase();  // Convert trading pair to coin id
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
            const data = await response.json();
            console.log(data);  // Log the data to see what's being returned
            return data[coin].usd.toFixed(2);
        } catch (error) {
            console.error('Error fetching price:', error);
            return '0.00';  // Return '0.00' on error
        }
    }

    function getDisplayName(tradingPair) {
        switch (tradingPair) {
            case 'COINBASE:BTCUSD':
                return 'Bitcoin (BTC)';
            case 'COINBASE:ETHUSD':
                return 'Ethereum (ETH)';
            case 'COINBASE:USDTUSD':
                return 'Tether (USDT)';
            case 'COINBASE:BNBUSD':
                return 'Binance Coin (BNB)';
            case 'COINBASE:XRPUSD':
                return 'XRP (XRP)';
            default:
                console.error('Unknown trading pair:', tradingPair);
                return '';
        }
    }
        
    // Update the name and price
    async function updateTradingPairInfo(tradingPair) {  // Marked as async
        const name = getDisplayName(tradingPair);
        const price = await getLatestPrice(tradingPair);  // Await the price
            
        // Update the DOM
        document.getElementById('trading-pair-name').textContent = name;
        document.getElementById('crypto-value').textContent = price;
    }

    function updateChart(tradingPair) {
        const tradingViewOptions = {
            autosize: true,
            symbol: tradingPair,
            timezone: "Etc/UTC",
            interval: "D",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: true,
            withdateranges: true,
            range: "YTD",
            hide_side_toolbar: false,
            allow_symbol_change: true,
            details: true,
            hotlist: true,
            calendar: true,
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650",
            container_id: 'tradingview_afe69'
        };
    
        // Update the top chart
        document.getElementById('tradingview_afe69').innerHTML = '';
        new TradingView.widget(tradingViewOptions);
    
    }
    
    document.getElementById('market-select').addEventListener('change', function() {
        const selectedMarket = document.getElementById('market-select').value;
        let tradingPair;
        switch(selectedMarket) {
            case 'ETH-USD':
                tradingPair = 'COINBASE:ETHUSD';
                break;
            case 'USDT-USD':
                tradingPair = 'COINBASE:USDTUSD';
                break;
            case 'BNB-USD':
                tradingPair = 'COINBASE:BNBUSD';
                break;
            case 'XRP-USD':
                tradingPair = 'COINBASE:XRPUSD';
                break;
            default:
                tradingPair = 'COINBASE:BTCUSD';  // Default to Bitcoin if no match
        }
        updateChart(tradingPair);
        updateTradingPairInfo(tradingPair);  // Update the trading pair info
    });

    // Initial Chart Load
    updateChart('COINBASE:BTCUSD');
    updateTradingPairInfo('COINBASE:BTCUSD');  // Initial trading pair info load
};

/* Order Form Script*/
// var orderFormVisible = false;
// document.getElementById('getStartedButton').addEventListener('click', function() {
//     orderFormVisible = !orderFormVisible;
//     document.getElementById('orderForm').hidden = !orderFormVisible;
// });
    
// document.addEventListener('DOMContentLoaded', () => {
//     // Toggle active class for buy/sell buttons
//     const buyButton = document.querySelectorAll('.buy-sell-btn')[0]; 
//     const sellButton = document.querySelectorAll('.buy-sell-btn')[1]; 
//     const placeOrderButton = document.querySelector('.place-order-btn');
//     const amountInput = document.getElementById('amount');
//     const feeSpan = document.querySelector('.fee');
//     const totalSpan = document.querySelector('.total');
//     const orderForm = document.querySelector('.order-form');

//     // Function to set button to default state
//     function setDefaultButtonState() {
//         buyButton.classList.remove('green', 'red');
//         buyButton.classList.add('gray');
//         sellButton.classList.remove('green', 'red');
//         sellButton.classList.add('gray');
//     }

//     // Initialize buttons to default state
//     setDefaultButtonState();

//     // Event listener for Buy button
//     buyButton.addEventListener('click', function() {
//         setDefaultButtonState();
//         buyButton.classList.add('green');
//         buyButton.classList.remove('gray');
        
//         placeOrderButton.textContent = 'PLACE BUY ORDER';
//         placeOrderButton.classList.add('green');
//         placeOrderButton.classList.remove('red', 'gray');
//     });

//     // Event listener for Sell button
//     sellButton.addEventListener('click', function() {
//         setDefaultButtonState();
//         sellButton.classList.add('red');
//         sellButton.classList.remove('gray');
        
//         placeOrderButton.textContent = 'PLACE SELL ORDER';
//         placeOrderButton.classList.add('red');
//         placeOrderButton.classList.remove('green', 'gray');
//     });


//     amountInput.addEventListener('input', () => {
//         // Allow only digits and a single dot for decimals
//         amountInput.value = amountInput.value.replace(/[^\d.]/g, '')
//                     .replace(/^(\d*\.)(.*)\.(.*)$/, '$1$2$3');

//         // Convert the current input to a float.
//         const amount = parseFloat(amountInput.value);

//         // Check if the amount is a number and greater than 0.
//         if (!isNaN(amount) && amount > 0) {
//             // Assuming a 1% fee for the calculation.
//             const fee = amount * 0.01;
//             // Subtract the fee from the amount to get the total.
//             const total = amount - fee;

//             // Update the fee and total on the webpage.
//             feeSpan.textContent = fee.toFixed(2);
//             totalSpan.textContent = total.toFixed(2);
//         } else {
//             // If the input is not a valid number or less than or equal to 0, display 'N/A'.
//             feeSpan.textContent = 'N/A';
//             totalSpan.textContent = 'N/A';
//         }
//     });

//     orderForm.addEventListener('submit', (e) => {
//         e.preventDefault();
    
//         // Prepare the data to be sent in a format that the server expect
//         const orderData = {
//             type: document.querySelector('.buy-sell-btn.buy-active') ? 'buy' : 'sell',
//             amount: amountInput.value,
//             fee: feeSpan.textContent,
//             total: totalSpan.textContent
//         };
    
//         // Use fetch to send the data to the server
//         fetch('https://myserver.com/place-order', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(orderData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//             alert(`Congratulation Your Order Was Placed for ${amountInput.value}!`); 
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             alert('An error occurred while placing the order.');
//         });
//     });
// });

function toggleActiveClass(buttons, activeClass) {
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove(activeClass));
            this.classList.add(activeClass);
        });
    });
}


document.addEventListener('DOMContentLoaded', async () => {
  const popupWrapper = document.querySelector('.popup-wrapper')
  const isAuth = isAuthenticated();

  const orderForm = document.querySelector('.order-form');
  const tickerSelect = document.querySelector('#select-ticker');
  const averageNoiseRatio = document.querySelector('#average-noise-ratio');
  const balanceRatio = document.querySelector('#balance-ratio');
  const enableButton = document.querySelector('.place-order-btn');

  if (!isAuth) {
    popupWrapper.innerHTML = `
      <a href="./login" class="log">Log In</a>
    `
    tickerSelect.disabled = true;
    orderForm.classList.remove('loading');
    averageNoiseRatio.disabled = true;
    balanceRatio.disabled = true;
    enableButton.style.opacity = 0.5;
    enableButton.style.pointerEvents = 'none';
    enableButton.textContent = 'Need to login';
    return
  }

  if (isAuth) {
    popupWrapper.innerHTML = `
      <span class="log">My Profile</span>
    `
    const profile = await api.getProfile();
    const popup = createProfilePopup(profile.data);
    popupWrapper.addEventListener('click', (event) => {
      if (event.target.closest('.popup-content')) {
        popupWrapper.removeChild(popup);
      } else {
        popupWrapper.appendChild(popup);
      }
    });
  }

  const tickers = await api.getTickers();
  const tradings = await api.getAutoTrading();
  for (const ticker of tickers.data) {
    const option = document.createElement('option');
    option.value = ticker.name
    option.textContent = ticker.name
    tickerSelect.appendChild(option);
  }
  let selectedTicker = tickerSelect.value;

  function tickerSelectChanged() {
    const ticker = tickerSelect.value;
    const trading = tradings.data[ticker]
    selectedTicker = ticker
    if (trading) {
      averageNoiseRatio.value = trading.k
      balanceRatio.value = trading.ratio
      enableButton.textContent = trading.enabled ? 'Disable' : 'Enable'
      enableButton.classList.toggle('enabled', trading.enabled)
    }
  }

  tickerSelect.addEventListener('change', tickerSelectChanged)
  tickerSelectChanged()

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedTrading = tradings.data[selectedTicker]
    if (selectedTrading.enabled) {
      const result = await api.disableAuthTrading(selectedTicker)
      if (!result.ok) {
        alert(result.error);
        return
      }
      averageNoiseRatio.value = null
      balanceRatio.value = null
      enableButton.textContent = 'Enable'
      enableButton.classList.remove('enabled')
      selectedTrading.enabled = false
      selectedTrading.k = null
      selectedTrading.ratio = null
      alert('Auto trading disabled!');
    } else {
      const ticker = tickerSelect.value;
      const averageNoiseRatioValue = +averageNoiseRatio.value;
      const balanceRatioValue = +balanceRatio.value;

      const result = await api.enableAutoTrading({
        ticker,
        k: averageNoiseRatioValue.toFixed(1),
        ratio: balanceRatioValue.toFixed(2),
      })

      if (!result.ok) {
        alert(result.error);
        return
      }
      enableButton.textContent = 'Disable'
      enableButton.classList.add('enabled')
      selectedTrading.enabled = true
      selectedTrading.k = averageNoiseRatioValue
      selectedTrading.ratio = balanceRatioValue
      if (result?.ok) {
        alert('Auto trading enabled!');
      }
    }
  });

  averageNoiseRatio.addEventListener('change', (event) => {
    event.target.value = formatNumberValue(event.target.value, {
      min: 0.1,
      max: 1.0,
      decimal: 0.1,
    }).toFixed(1);
  });

  balanceRatio.addEventListener('change', (event) => {
    event.target.value = formatNumberValue(event.target.value, {
      min: 0.01,
      max: 1.0,
      decimal: 0.01,
    }).toFixed(2);
  });

  orderForm.classList.remove('loading');
});

function createProfilePopup(profile) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
    <div class="popup-content">
      <p class="profile-email">Email: ${profile.email}</p>
      <p class="profile-account">Account: ${profile.account}</p>
    </div>
  `;
  return popup;
}


function formatNumberValue(value, opts) {
  const { min, max, decimal } = opts;
  value = Math.min(max, Math.max(min, value));
  const length = `${decimal}`.split('.')[1].length || 0;
  return Number(value.toFixed(length));
}
