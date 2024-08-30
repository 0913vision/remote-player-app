import { UDPPort } from 'osc';

const x32Client = new UDPPort({
    localAddress: "0.0.0.0",
    localPort: 0,
    remoteAddress: "192.168.0.3", // OSC 서버의 IP 주소
    remotePort: 10023 // OSC 서버의 포트 번호
  });

x32Client.open();
x32Client.on("ready", () => {
    console.log("x32Client is ready.");
});

function toggleMuteGroup() {
    return new Promise((resolve, reject) => {
      const muteAddress = `/config/mute/2`;
  
      const sequence = async () => {
            try {
                // 먼저 mute를 1(on)으로 설정
                await sendOscCommand(muteAddress, 1);
                
                // 0.5초 대기
                await new Promise(res => setTimeout(res, 200));
                
                // 그 다음 mute를 0(off)으로 설정
                await sendOscCommand(muteAddress, 0);
                
                resolve();
            } catch (error) {
                reject(error);
            }
        };
  
      sequence();
    });
}

function sendOscCommand(address, args) {
    return new Promise((resolve, reject) => {
        x32Client.send({
            address: address, 
            args: args
        });
        resolve();
    });
}

function micOn() {
    toggleMuteGroup();
}

export { micOn };