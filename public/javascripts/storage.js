if(typeof(account) == 'undefined' || account == "[object Object]"){
    if(window.sessionStorage.getItem("account") == null || typeof(window.sessionStorage.getItem("account")) == 'undefined' || window.sessionStorage.getItem("account") == '[object Object'){
        if(window.localStorage.getItem("account") == null || typeof(window.localStorage.getItem("account")) == 'undefined' || window.localStorage.getItem("account") == '[object Object'){
            var account = {url: 'login', username: 'login', save: false}
        } else {
            var account = {url: JSON.parse(window.localStorage.getItem("account")).url, username: JSON.parse(window.localStorage.getItem("account")).username, save: JSON.parse(window.localStorage.getItem("account")).save}
        }
    } else {
        var account = {url: JSON.parse(window.sessionStorage.getItem("account")).url, username: JSON.parse(window.sessionStorage.getItem("account")).username, save: JSON.parse(window.sessionStorage.getItem("account")).save}
    }    
}
if(account.save){
    window.localStorage.setItem("account", JSON.stringify({url: account.url, username: account.username, save: account.save}))
} else {
    window.sessionStorage.setItem("account", JSON.stringify({url: account.url, username: account.username, save: account.save}))
}

var accountLink = document.createElement("a");
accountLink.innerHTML = `<a href='/users/${account.url}'>${account.username}</a>`;
document.getElementById("accountLink").appendChild(accountLink);