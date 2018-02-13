# pluracoin-block-explorer-php
PluraCoin Block Explorer with PHP API

SETUP
1) Upload to your website and change 'api' variable in config.js to point your pluracoind daemon
2) Scripts take data from pluracoind daemon. You can run pluracoind available from the internet with following command

```./pluracoind --restricted-rpc --enable-cors=* --enable-blockchain-indexes --rpc-bind-ip=0.0.0.0 --rpc-bind-port=19214```

Don't forget to allow incoming requests to port 19214 on your firewall. If you run the daemon and explorer on the same machine then changes at firewall are not needed.
