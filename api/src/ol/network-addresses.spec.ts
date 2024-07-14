import { NetworkAddresses } from './network-addresses.js';

describe('network-addresses', () => {
  it('deserialize network addresses', () => {
    const addresses = [
      [
        '012d0400b98789360524180720517cb4962e45afb8f66ced74773967b716b96aa44c2956799355495b51bbe71b0800',
        '/ip4/185.135.137.54/tcp/6180/noise-ik/0x517cb4962e45afb8f66ced74773967b716b96aa44c2956799355495b51bbe71b/handshake/0',
      ],
      [
        '012d040049b5733505261807203dbb2cc9a7c17072b18ed4aa31c806acfbc0ad92da934a2e1338a715e7473d480800',
        '/ip4/73.181.115.53/tcp/6182/noise-ik/0x3dbb2cc9a7c17072b18ed4aa31c806acfbc0ad92da934a2e1338a715e7473d48/handshake/0',
      ],
      [
        '012d0400416c0ff0052618072015878523172483c401cc6a674d9a127586db107cf062b113661f6b8521fccf160800',
        '/ip4/65.108.15.240/tcp/6182/noise-ik/0x15878523172483c401cc6a674d9a127586db107cf062b113661f6b8521fccf16/handshake/0',
      ],
      [
        '012d0400416d1e0e05241807207ffc26fff0b0ddd863a0d82f0fd5dfb6f42ea9bf172e41d46e1227f550f7173c0800',
        '/ip4/65.109.30.14/tcp/6180/noise-ik/0x7ffc26fff0b0ddd863a0d82f0fd5dfb6f42ea9bf172e41d46e1227f550f7173c/handshake/0',
      ],
      [
        '012d0400905b69ee0524180720f05b2fbbf1759966ac4ee5386ebdae5cc7740d22eacef75a394f60c3b83253480800',
        '/ip4/144.91.105.238/tcp/6180/noise-ik/0xf05b2fbbf1759966ac4ee5386ebdae5cc7740d22eacef75a394f60c3b8325348/handshake/0',
      ],
      [
        '012d0400905b69ee0524180720f05b2fbbf1759966ac4ee5386ebdae5cc7740d22eacef75a394f60c3b83253480800',
        '/ip4/144.91.105.238/tcp/6180/noise-ik/0xf05b2fbbf1759966ac4ee5386ebdae5cc7740d22eacef75a394f60c3b8325348/handshake/0',
      ],
      [
        '012d0400416d15e605241807201c6e935daa380576bc9fb1984ec7725009e121f23954a80300f6097e163c55070800',
        '/ip4/65.109.21.230/tcp/6180/noise-ik/0x1c6e935daa380576bc9fb1984ec7725009e121f23954a80300f6097e163c5507/handshake/0',
      ],
      ['00', ''],
      [
        '012d0400416d4f7505241807201870dcf5e8e0924ab284dce9f758d53807e22f2747a9e46708daf921e671342c0800',
        '/ip4/65.109.79.117/tcp/6180/noise-ik/0x1870dcf5e8e0924ab284dce9f758d53807e22f2747a9e46708daf921e671342c/handshake/0',
      ],
      [
        '012d0400416d5ff005241807209d1ea24b7b2d8fc871f47845ccb0ea91bd56c5665e908965ee56a42eafd8d9650800',
        '/ip4/65.109.95.240/tcp/6180/noise-ik/0x9d1ea24b7b2d8fc871f47845ccb0ea91bd56c5665e908965ee56a42eafd8d965/handshake/0',
      ],
      [
        '012d0400416d5ff005241807209d1ea24b7b2d8fc871f47845ccb0ea91bd56c5665e908965ee56a42eafd8d9650800',
        '/ip4/65.109.95.240/tcp/6180/noise-ik/0x9d1ea24b7b2d8fc871f47845ccb0ea91bd56c5665e908965ee56a42eafd8d965/handshake/0',
      ],
      [
        '012d040052a5fa4205241807206c3f93028522845daaecf17d2c2a1359473435d9491b593e39a8c839371de03e0800',
        '/ip4/82.165.250.66/tcp/6180/noise-ik/0x6c3f93028522845daaecf17d2c2a1359473435d9491b593e39a8c839371de03e/handshake/0',
      ],
      [
        '012d04005e8216560525180720bc2d1a55f90dfd27e4ef871285f13386997aecf609a3c4d4c4527efc9b2d193e0800',
        '/ip4/94.130.22.86/tcp/6181/noise-ik/0xbc2d1a55f90dfd27e4ef871285f13386997aecf609a3c4d4c4527efc9b2d193e/handshake/0',
      ],
      [
        '012d04005e8221a605241807207cdc99035e203f58a97ad98431c1657d5e175bee47c2a26ddaa4426a306ca64d0800',
        '/ip4/94.130.33.166/tcp/6180/noise-ik/0x7cdc99035e203f58a97ad98431c1657d5e175bee47c2a26ddaa4426a306ca64d/handshake/0',
      ],
      [
        '012d0400416d24be052418072018ffaa68856dbfc08ed730e593b8b36d86895c48c336df662a0932c9fc0e27200800',
        '/ip4/65.109.36.190/tcp/6180/noise-ik/0x18ffaa68856dbfc08ed730e593b8b36d86895c48c336df662a0932c9fc0e2720/handshake/0',
      ],
      [
        '012d0400416d24be052418072018ffaa68856dbfc08ed730e593b8b36d86895c48c336df662a0932c9fc0e27200800',
        '/ip4/65.109.36.190/tcp/6180/noise-ik/0x18ffaa68856dbfc08ed730e593b8b36d86895c48c336df662a0932c9fc0e2720/handshake/0',
      ],
      [
        '012d04004014240e0525180720a958d88745c181a28d0323cb0f12a6bc620cdc3694ef3a2dc1873854ee8185500800',
        '/ip4/64.20.36.14/tcp/6181/noise-ik/0xa958d88745c181a28d0323cb0f12a6bc620cdc3694ef3a2dc1873854ee818550/handshake/0',
      ],
      [
        '012d04004217e8560524180720715142054da65e86c36c6c258a2977e21716b810657a2d03c7a7127655c575480800',
        '/ip4/66.23.232.86/tcp/6180/noise-ik/0x715142054da65e86c36c6c258a2977e21716b810657a2d03c7a7127655c57548/handshake/0',
      ],
      [
        '012d04006391c8620524180720836219f8733d0c2663c0164568e079dcc0a1e6b24ab5c8bc09e157f17101a2020800',
        '/ip4/99.145.200.98/tcp/6180/noise-ik/0x836219f8733d0c2663c0164568e079dcc0a1e6b24ab5c8bc09e157f17101a202/handshake/0',
      ],
      [
        '012d040043d93133052418072034b1af0034528b73f7c8cb1ce345f9c4f6818d8b920b00c5ab78e473594ad2720800',
        '/ip4/67.217.49.51/tcp/6180/noise-ik/0x34b1af0034528b73f7c8cb1ce345f9c4f6818d8b920b00c5ab78e473594ad272/handshake/0',
      ],
      [
        '012d0400bca617120524180720cd8b02613e3cc219d21e31ec53c8aba3568ac7e4b3640fc96b38614636a74e740800',
        '/ip4/188.166.23.18/tcp/6180/noise-ik/0xcd8b02613e3cc219d21e31ec53c8aba3568ac7e4b3640fc96b38614636a74e74/handshake/0',
      ],
      [
        '012d040052df13880524180720ce7168ac62fde698c34d2e7b968f8b7b4be7cce221829dbcc3761fdf1aefaf700800',
        '/ip4/82.223.19.136/tcp/6180/noise-ik/0xce7168ac62fde698c34d2e7b968f8b7b4be7cce221829dbcc3761fdf1aefaf70/handshake/0',
      ],
      [
        '012d0400339f64d905251807205227b4c0f58f8ccdade360975ebd134c3546e2d581561360e25b45f1b531ce270800',
        '/ip4/51.159.100.217/tcp/6181/noise-ik/0x5227b4c0f58f8ccdade360975ebd134c3546e2d581561360e25b45f1b531ce27/handshake/0',
      ],
      [
        '012d0400339f651f0524180720bbc8ed72f985c8bd4ba546829432595b83c53e568f31c0d1775636f3b177ec090800',
        '/ip4/51.159.101.31/tcp/6180/noise-ik/0xbbc8ed72f985c8bd4ba546829432595b83c53e568f31c0d1775636f3b177ec09/handshake/0',
      ],
      [
        '012d0400416d1e370524180720e41c5b51f18d9826ca23136f0edc442d701c82c246ed1f306ece495e763df8230800',
        '/ip4/65.109.30.55/tcp/6180/noise-ik/0xe41c5b51f18d9826ca23136f0edc442d701c82c246ed1f306ece495e763df823/handshake/0',
      ],
      [
        '012d040058c633fa052518072073b3cf80bb90042fcecd19c533cdbf3400521c5ef1d564603b9e749182abb7740800',
        '/ip4/88.198.51.250/tcp/6181/noise-ik/0x73b3cf80bb90042fcecd19c533cdbf3400521c5ef1d564603b9e749182abb774/handshake/0',
      ],
      [
        '012d040058c633f90524180720ae048b6866487aad7563376e201e7fa7056e97e25f9b11d9f1dd217f1813dd730800',
        '/ip4/88.198.51.249/tcp/6180/noise-ik/0xae048b6866487aad7563376e201e7fa7056e97e25f9b11d9f1dd217f1813dd73/handshake/0',
      ],
      [
        '012d040068f85ec305251807209ac157ee324e4129c9edac7ba5eca70af299929ae8c0d7362f4e6c75a7ac447e0800',
        '/ip4/104.248.94.195/tcp/6181/noise-ik/0x9ac157ee324e4129c9edac7ba5eca70af299929ae8c0d7362f4e6c75a7ac447e/handshake/0',
      ],
      [
        '012d04009f41cb8a0524180720c1954be575981591f2eabd67913c839657ac45a866b15bff40b5d80eb4d827780800',
        '/ip4/159.65.203.138/tcp/6180/noise-ik/0xc1954be575981591f2eabd67913c839657ac45a866b15bff40b5d80eb4d82778/handshake/0',
      ],
      [
        '012d04009edc7b210524180720ecade13ac99d1e085453382e2d6965453906daa380126198ea2006c5708ca23b0800',
        '/ip4/158.220.123.33/tcp/6180/noise-ik/0xecade13ac99d1e085453382e2d6965453906daa380126198ea2006c5708ca23b/handshake/0',
      ],
      [
        '012d04009edc7b210524180720ecade13ac99d1e085453382e2d6965453906daa380126198ea2006c5708ca23b0800',
        '/ip4/158.220.123.33/tcp/6180/noise-ik/0xecade13ac99d1e085453382e2d6965453906daa380126198ea2006c5708ca23b/handshake/0',
      ],
      [
        '012d0400de651ff20525180720dcab287b256bb1e90cda2537553ee19cac195ce67c2fefc7ff25b8aaf2368e6d0800',
        '/ip4/222.101.31.242/tcp/6181/noise-ik/0xdcab287b256bb1e90cda2537553ee19cac195ce67c2fefc7ff25b8aaf2368e6d/handshake/0',
      ],
      [
        '012d040088f4473f052418072085bdd9240cae48f24e6bfbc440f878a99a9d29e2113773d089808221b96f397d0800',
        '/ip4/136.244.71.63/tcp/6180/noise-ik/0x85bdd9240cae48f24e6bfbc440f878a99a9d29e2113773d089808221b96f397d/handshake/0',
      ],
      [
        '012d0400ac68d3080525180720c04300abebc472cdea0e1f7160ece6c09e49145c2b5b72318bdc43c11aceb2030800',
        '/ip4/172.104.211.8/tcp/6181/noise-ik/0xc04300abebc472cdea0e1f7160ece6c09e49145c2b5b72318bdc43c11aceb203/handshake/0',
      ],
      [
        '012d0400ac68d6fe0524180720481b1c5f30c472b1463445f6e9b8ed517cab75e2c3775ac2704db55c89df7a190800',
        '/ip4/172.104.214.254/tcp/6180/noise-ik/0x481b1c5f30c472b1463445f6e9b8ed517cab75e2c3775ac2704db55c89df7a19/handshake/0',
      ],
      [
        '012d0400460ff20605261807201017ce1abc30e356660b8b0542275f2fb4373b5f8a82b7800a5b3fdf718ae55f0800',
        '/ip4/70.15.242.6/tcp/6182/noise-ik/0x1017ce1abc30e356660b8b0542275f2fb4373b5f8a82b7800a5b3fdf718ae55f/handshake/0',
      ],
      [
        '012d0400ccba4a2c05241807203c37c7d6a5122a6b9ef07a11cc40e445874eb0841ae028d6326bf67768cce2350800',
        '/ip4/204.186.74.44/tcp/6180/noise-ik/0x3c37c7d6a5122a6b9ef07a11cc40e445874eb0841ae028d6326bf67768cce235/handshake/0',
      ],
      [
        '012d0400bc286b6905241807201691a108495c157d4aaa0c95b7b3f704ca5d2aca7fe359ff82e435733e3216030800',
        '/ip4/188.40.107.105/tcp/6180/noise-ik/0x1691a108495c157d4aaa0c95b7b3f704ca5d2aca7fe359ff82e435733e321603/handshake/0',
      ],
      [
        '012d0400416d50b30525180720619898b2f99fba7b25fae35e3eab03164d7d9ce0d10abe8f6ceae9a43ffa1c340800',
        '/ip4/65.109.80.179/tcp/6181/noise-ik/0x619898b2f99fba7b25fae35e3eab03164d7d9ce0d10abe8f6ceae9a43ffa1c34/handshake/0',
      ],
      [
        '012d040033516da8052418072072f8b945ed995dda94212fdc0a8e90a66972053fe0e1c7b4481b2cf512d7615a0800',
        '/ip4/51.81.109.168/tcp/6180/noise-ik/0x72f8b945ed995dda94212fdc0a8e90a66972053fe0e1c7b4481b2cf512d7615a/handshake/0',
      ],
      [
        '012d04009b8516c80525180720cdb76ab0742af133792c61ec111805eb64b3d07b4dacea5fd1fefcf3d05a9c1e0800',
        '/ip4/155.133.22.200/tcp/6181/noise-ik/0xcdb76ab0742af133792c61ec111805eb64b3d07b4dacea5fd1fefcf3d05a9c1e/handshake/0',
      ],
      [
        '012d0400b98789360524180720517cb4962e45afb8f66ced74773967b716b96aa44c2956799355495b51bbe71b0800',
        '/ip4/185.135.137.54/tcp/6180/noise-ik/0x517cb4962e45afb8f66ced74773967b716b96aa44c2956799355495b51bbe71b/handshake/0',
      ],
    ];

    for (const [encoded, decoded] of addresses) {
      const bytes = Buffer.from(encoded, 'hex');

      const networkAddresses = NetworkAddresses.fromBytes(bytes);
      expect(networkAddresses?.toString() ?? '').toBe(decoded);
    }
  });
});
