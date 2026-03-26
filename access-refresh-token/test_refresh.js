const http = require('http');

async function testRefresh() {
    try {
        console.log('Testing login...');
        const loginData = new URLSearchParams({ email: 'testuser@example.com', password: 'password123' }).toString();
        
        const loginReq = http.request('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': loginData.length
            }
        });
        
        loginReq.on('response', (res) => {
            const cookies = res.headers['set-cookie'];
            console.log('Login Set-Cookie:', cookies);
            
            let accessToken, refreshToken;
            if (cookies) {
                cookies.forEach(c => {
                    if (c.startsWith('accessToken=')) accessToken = c.split(';')[0];
                    if (c.startsWith('refreshToken=')) refreshToken = c.split(';')[0];
                });
            }
            
            console.log('Got tokens:\\n', accessToken, '\\n', refreshToken);
            console.log('Waiting 21 seconds for accessToken to expire...');
            
            setTimeout(() => {
                console.log('Hitting /view/dashboard with expired accessToken...');
                const dashReq = http.request('http://localhost:4000/view/dashboard', {
                    headers: { 'Cookie': `${accessToken}; ${refreshToken}` }
                });
                
                dashReq.on('response', (res2) => {
                    console.log('Dashboard Response status:', res2.statusCode);
                    console.log('Dashboard Location:', res2.headers.location);
                    
                    if (res2.statusCode === 302 && res2.headers.location === '/token/generate') {
                        console.log('Got expected redirect to /token/generate. Following redirect...');
                        const tokenReq = http.request('http://localhost:4000/token/generate', {
                            headers: { 'Cookie': `${accessToken}; ${refreshToken}` }
                        });
                        
                        tokenReq.on('response', (res3) => {
                            console.log('/token/generate Response status:', res3.statusCode);
                            console.log('/token/generate Location:', res3.headers.location);
                            console.log('/token/generate Set-Cookie:', res3.headers['set-cookie']);
                        });
                        tokenReq.end();
                    } else {
                        console.log('UNEXPECTED RESPONSE:', res2.statusCode, res2.headers.location);
                    }
                });
                dashReq.end();
            }, 21000);
        });
        
        loginReq.write(loginData);
        loginReq.end();
    } catch(e) {
        console.error(e);
    }
}
testRefresh();
