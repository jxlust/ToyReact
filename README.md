##  1.webpack打包
```
npx webpack
```

## 2. loader 
-D 开发环境依赖(devDependencies)
-S 依赖库
```
cnpm i babel-loader @babel/core @babel/preset-env -D
```

## 3.正则表达式$1
```

var r= /^(\d{4})-(\d{1,2})-(\d{1,2})$/; //正则表达式 匹配出生日期(简单匹配)     

r.exec('1985-10-15');

s1=RegExp.$1;

s2=RegExp.$2;

s3=RegExp.$3;

alert(s1+" "+s2+" "+s3)//结果为1985 10 15
```
这样的语句(str是字符串，expr是正则表达式对象)。
RegExp.$1 是第一个匹配结果。
```
if("2009-12-17".match(/(\d{4})-(\d+)-(\d+)/)) {

  alert(RegExp.$1 + '年' + RegExp.$2 + '月' + RegExp.$3 + '日');

}});

```