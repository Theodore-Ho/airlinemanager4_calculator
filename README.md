# airlinemanager4_calculator

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

Ticket price is irrelevant with aircraft (except A320-VIP).

Economy class price ≈ Distance * 0.3
Business class price ≈ Distance * 0.6
First class price ≈ Distance * 0.9

Calculate by the python script, result follows:

Economy
0~3000: Coefficient=0.30006657662760705, Intercept=151.12470767146004
3000~6000: Coefficient=0.30016389033443247, Intercept=149.7463368491142
6000~9000: Coefficient=0.2996803580402481, Intercept=152.83961625441134
9000~12000: Coefficient=0.30047645766876613, Intercept=139.25983697172342
12000~15000: Coefficient=0.30712040767898274, Intercept=55.44994431799478
15000~18000: Coefficient=0.31412459952464344, Intercept=-128.43596619286927
18000~inf: Coefficient=0.007545684704148931, Intercept=5569.076772988145

Business
0~3000: Coefficient=0.6000139814536021, Intercept=500.3344526508572
3000~6000: Coefficient=0.6000666304497729, Intercept=500.23892216390004
6000~9000: Coefficient=0.5993121478432734, Intercept=505.3508306903659
9000~12000: Coefficient=0.6010390223871501, Intercept=476.8106058160629
12000~15000: Coefficient=0.6144119367275982, Intercept=308.306843746117
15000~18000: Coefficient=0.6283327999654811, Intercept=-58.70979784759402
18000~inf: Coefficient=0.014348086239179032, Intercept=11352.676009311233

First
0~3000: Coefficient=0.900058493098122, Intercept=1000.3987018253197
3000~6000: Coefficient=0.9000663256792767, Intercept=1000.1902306960255
6000~9000: Coefficient=0.899148557578444, Intercept=1006.4743960282949
9000~12000: Coefficient=0.9013651304282522, Intercept=967.4692540317646
12000~15000: Coefficient=0.9218365601748165, Intercept=709.4802638154542
15000~18000: Coefficient=0.9425472929483976, Intercept=161.1656709467934
18000~inf: Coefficient=0.021314038714312034, Intercept=17283.128298981428
