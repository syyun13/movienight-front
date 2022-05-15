module.exports = {
    getUser: function(){
        const userId = sessionStorage.getItem('userId');
        if(userId === 'undefined' || !userId) return null;
        else return JSON.parse(userId);
    },
    setUserSession: function(userId){
        sessionStorage.setItem('userId', JSON.stringify(userId));
    },
    resetUserSession: function(){
        sessionStorage.removeItem('userId');
    }
}