## CSS 说明文档
  ####规范说明
````
1.基础样式：base.less（一般情况不需要修改，可以酌情添加需要的样式）

2.布局样式：

  1）float布局：bootstrap.less（集成了BT2.0中关于栅格布局这一块的代码，如引用基础组件，需要自己从线上源码copy引入该文件）
  
  2）flex布局：component.less（自定义的一些常用的flex布局类，需要去了解，然后对照注释使用到项目当中，可以在原有基础上继续添加）
  
  3）项目主样式：main.less(main根据不同项目命名，实际开发中，这个文件是我们书写样式代码的主文件，请务必维护好，标好代码注释，每写一个模块或者页面的样式，请在开头和结尾添加对应模块的注释，如/**  start 主页导航*/ 代码部分 /**  end 主页导航*/)

3.CSS类名约定：选用"BEM"命名规范，类名最多采用三级连接，统一使用_作为连接符，不局限于”BEM“传统的定义，根据我们自身项目实际情况对“BEM”进行理解
  
  1) 对于B的命名约定：一般通过页面上的功能模块进行第一段类名的选择，.upload_box；也可以选用该页面的特征，比如有登录页，注册页，那么B这一段就可以用.login_xxx_xxx.
  
  2) 对于E的命名约定：建议是用描述性的，第一眼就能明白是页面的哪一个部分，界定某一元素的特征。比如，desc描述(.upload_desc_box)，title标题(.upload_title_font)，optimize优化(.pubg_opt_icon).
  
  3) 对于M的命名约定：一般指代页面上的基本元素或者小组件，如字体font，图片img，盒子box，子盒子cell，按钮btn，输入框ipt，图标icon，列表list等等
  
4.LESS代码书写

  1) 全局主题色变量，整个项目的UI色彩风格保持与设计稿一致，相关的颜色变量可以多设置几个，主题色，副主题色，主题附加色等等。
  
  2) 嵌套规则限制，原则上不允许嵌套超过三级，这样不利于修改样式，一旦在类名重复的情况下，修改样式会非常费劲。对于全局可复用单位组件的样式可以采用内联样式书写。
  
  3) 类名同级地位，在项目主样式文件中，每一个类名都应当保持同级位置排列，也就是全局的，搜索即唯一，这样的好处是在修改样式时可以提高效率，并且不会影响到其他样式，唯一修改，唯一改变。
  
  4) 代码格式约定为一个tab等于4个空格，尽量使用缩写属性（margin,padding），0后面不加单位，去掉小数点前面的0，每一个类之间隔一行，每个选择器独占一行。
  
  5）不写ID样式，一律用class类来表示样式，禁止在全局写标签样式，建议使用子选择器，少使用或不适用后代选择器，
  
5.第三方UI样式

  1）如果需要全局修改某些元素样式，请在base.less中进行相关样式覆盖，（原则上应当禁止在main.less中直接覆盖第三方UI样式），如主题色，包括文字颜色，hover、focus效果，选中效果等等可视化强的页面样式，配合自身项目的主题色进行全局覆盖修改；
  
  2）对于只在某一个页面或者页面模块的组件元素的样式修改，为保证不影响该组件的全局样式，需要自定义一个类名添加在该组件外层，在该类名嵌套下进行组件样式的局部自定义修改；
  
  3）一些常见的组件的样式，如input框、下拉列表，进度条、table表格，翻页器等，建议与UI协商，在保证设计美观的前提下，遵循组件样式的合规性（尽量不去修改第三方组件核心样式，宽高大小可以调整，细节样式不做大改），
     如我们目前项目中的element以及vant，官方文档中也有对应的设计原稿模型，设计可以参考（对应可以提高设计效率），这样既可以提高页面的开发效率，也可以保证设计与开发之间的协调性；


````
  ####flex布局
  
````
横向flex布局类说明
  1. flex_sbe：横向-主轴对齐方式space-between，交叉轴对齐方式 center，不自动换行（横向两端对齐，纵向居中，不换行）
  
  2. flex_sbe_wrap：横向-主轴对齐方式space-between，交叉轴对齐方式 center，自动换行（横向两端对齐，纵向居中，换行）
  
  3. flex_al_start：横向-主轴对齐方式 center，交叉轴对齐方式 flex-start，不自动换行（横向居中对齐，纵向顶部对齐，不换行）
  
  4. flex_row_center_top：横向-主轴对齐方式 space-between，交叉轴对齐方式flex-start，不自动换行（横向两端对齐，纵向顶部对齐，不换行）
  
  5. flex_al_end：横向-主轴对齐方式 center，交叉轴对齐方式 flex-end，不自动换行（横向居中对齐，纵向底部对齐，不换行）
  
  6. flex_al_center：横向-主轴对齐方式 center，交叉轴对齐方式 center，不自动换行（横向居中对齐，纵向居中对齐，不换行）
  
  7. flex_al_baseline：横向-主轴对齐方式 center，交叉轴对齐方式 baseline，不自动换行（横向居中对齐，纵向内容基线对齐，不换行）
  
  8. flex_col_item_left：横向-主轴对齐方式 space-between，交叉轴对齐方式flex-start，不自动换行（横向两端对齐，纵向顶部对齐，不换行）
  
  9. flex_row_item_right：横向-主轴对齐方式 flex-start，交叉轴对齐方式flex-end，不自动换行（横向靠左对齐，纵向顶部对齐，不换行）
  
  10. flex_row_center：横向-主轴对齐方式 center，交叉轴对齐方式center，不自动换行（横向居中对齐，纵向居中对齐，不换行）
  
  11. flex_row_start：横向-主轴对齐方式 flex-start，交叉轴对齐方式center，不自动换行（横向靠左对齐，纵向居中对齐，不换行）
  
  12. flex_row_top：横向-主轴对齐方式 flex-start，交叉轴对齐方式 flex-start，不自动换行（横向靠左对齐，纵向顶部对齐，不换行）
  
  13. flex_row_start_wrap：横向-主轴对齐方式 flex-start，交叉轴对齐方式 center，自动换行（横向靠左对齐，纵向居中对齐，不换行）
  
  14. flex_row_top_wrap：横向-主轴对齐方式 flex-start，交叉轴对齐方式 center，自动换行（横向靠左对齐，纵向居中对齐，换行）
  
  15. flex_row_top_start：横向-主轴对齐方式 flex-start，交叉轴对齐方式 flex-start，不自动换行（横向靠左对齐，纵向顶部对齐，不换行）
  
  16. flex_row_end：横向-主轴对齐方式 flex-end，交叉轴对齐方式 center，不自动换行（横向靠右对齐，纵向居中对齐，不换行）
  
  17. flex_row_between：横向-主轴对齐方式 flex-end，交叉轴对齐方式 center，不自动换行（横向靠右对齐，纵向居中对齐，不换行）
  
  18. flex_row_around：横向-主轴对齐方式 space-around，交叉轴对齐方式 center，不自动换行（横向均匀环绕对齐，纵向居中对齐，不换行）
  
  19. flex_wrap_row_start：横向-主轴对齐方式 center，交叉轴对齐方式 center，自动换行（横向居中对齐，纵向居中对齐，换行）
  
  20. flex_wrap_row_between：横向-主轴对齐方式 space-between，交叉轴对齐方式 center，自动换行（横向两端对齐，纵向居中对齐，换行）
  
  21. flex_wrap_row_around：横向-主轴对齐方式 space-around，交叉轴对齐方式 center，自动换行（横向均匀环绕对齐，纵向居中对齐，换行）
  
  22. flex_cen_start_top：横向-主轴对齐方式 flex-start，交叉轴对齐方式 flex-start，不自动换行（横向靠左对齐，纵向顶部对齐，换行）
  
  
纵向flex布局类说明
   
  1.flex_content_left：纵向-主轴对齐方式 center，交叉轴对齐方式 flex-start，无自动换行效果（垂直居中对齐，水平靠左，不换行）
  
  2.flex_column_center：纵向-主轴对齐方式 center，交叉轴对齐方式 center，不自动换行（垂直居中对齐，水平居中，不换行）
  
  3.flex_column_start：纵向-主轴对齐方式 flex-start，交叉轴对齐方式 center，不自动换行（垂直靠左对齐，水平居中，不换行）
  
  4.flex_column_end：纵向-主轴对齐方式 flex-end，交叉轴对齐方式 center，不自动换行（垂直靠右对齐，水平居中，不换行）
  
  5.flex_column_between：纵向-主轴对齐方式 space-between，交叉轴对齐方式 center，不自动换行（垂直两端对齐，水平居中，不换行）
  
  6.flex_column_around：纵向-主轴对齐方式 space-around，交叉轴对齐方式 默认，不自动换行（垂直均匀环绕，水平auto，不换行）
  
 ````
 ###常用类
    ####布局类###
    1. f_left:左浮动，float: left
    2. f_right:右浮动，float: right
    3. clear_fix:清除浮动
    
    ####距离类###
    1. mar_t5 :margin-top: 5px; 
       mar_b5 :margin-bottom: 5px; 
       mar_l5 :margin-left: 5px; 
       mar_r5 :margin-right: 5px; 
       
    2. mar_t10 :margin-top: 10px; 
       mar_b10 :margin-bottom: 10px; 
       mar_l10 :margin-left: 10px; 
       mar_r10 :margin-right: 10px; 
       
    3. mar_t15 :margin-top: 15px; 
       mar_b15 :margin-bottom: 15px; 
       mar_l15 :margin-left: 15px; 
       mar_r15 :margin-right: 15px; 
       
    4. mar_t20 :margin-top: 20px; 
       mar_b20 :margin-bottom: 20px; 
       mar_l20 :margin-left: 20px; 
       mar_r20 :margin-right: 20px; 
       
    5. mar_t25 :margin-top: 25px;
       mar_b25 :margin-bottom: 25px; 
       mar_l25 :margin-left: 25px;
       mar_r25 :margin-right: 25px;
       
    6. mar_t30 :margin-top: 30px; 
       mar_b30 :margin-bottom: 30px;
       mar_l30 :margin-left: 30px;
       mar_r30 :margin-right: 30px;
       
    7. mar_t35 :margin-top: 35px;
       mar_b35 :margin-bottom: 35px; 
       mar_l35 :margin-left: 35px;
       mar_r40 :margin-right: 40px;
       
    8. mar_t40 :margin-top: 40px;
       mar_b40 :margin-bottom: 40px;
       mar_l40 :margin-left: 40px;
       mar_r40 :margin-rigth: 40px;
       
    9. mar_t45 :margin-top: 45px; 
       mar_b45 :margin-bottom: 45px;
       mar_l45 :margin-left: 45px;
       mar_r45 :margin-rigth: 45px;
       
    10. mar_t50 :margin-top: 50px;
        mar_b50 :margin-bottom: 50px;
        mar_l50 :margin-left: 50px;
        mar_r50 :margin-right: 50px;
        
    11. pad_t5 :padding-top: 5px;
        pad_b5 :padding-bottom: 5px;
        pad_l5 :padding-left: 5px;
        pod_r5 :padding-right: 5px;
        
    12. pad_t10 :padding-top: 10px;
        pad_b10 :padding-bottom: 10px;
        pad_l10 :padding-left: 10px;
        pod_r10 :padding-right: 10px;
        
    13. pad_t15 :padding-top: 15px;
        pad_b15 :padding-bottom: 15px;
        pad_l15 :padding-left: 15px;
        pod_r15 :padding-right: 15px;
        
    14. pad_t20 :padding-top: 20px;
        pad_b20 :padding-bottom: 20px;
        pad_l20 :padding-left: 20px;
        pod_r20 :padding-right: 20px;
    
    15. pad_t25 :padding-top: 25px;
        pad_b25 :padding-bottom: 25px;
        pad_l25 :padding-left: 25px;
        pod_r25 :padding-right: 25px;
    
    16. pad_t30 :padding-top: 30px;
        pad_b30 :padding-bottom: 30px;
        pad_l30 :padding-left: 30px;
        pod_r30 :padding-right: 30px;
    
    17. pad_t35 :padding-top: 35px;
        pad_b35 :padding-bottom: 35px;
        pad_l35 :padding-left: 35px;
        pod_r35 :padding-right: 35px;
    
    18. pad_t40 :padding-top: 40px;
        pad_b40 :padding-bottom: 40px;
        pad_l40 :padding-left: 40px;
        pod_r40 :padding-right: 40px;
    
    19. pad_t45 :padding-top: 45px;
        pad_b45 :padding-bottom: 45px;
        pad_l45 :padding-left: 45px;
        pod_r45 :padding-right: 45px;
    
    20. pad_t50 :padding-top: 50px;
        pad_b50 :padding-bottom: 50px;
        pad_l50 :padding-left: 50px;
        pod_r50 :padding-right: 50px;
            
    
    ####显示隐藏####
    1. hide :隐藏 display:none;
    2. show :显示 display:block;
    3. hidden :隐藏 visibility: hidden;
    4. visible :显示 visibility: visible;
    5. overflow :溢出隐藏 overflow: hidden;
    
    ####文字内容排列、缩进、省略号####
    1. text_center :文字居中 text-align: center;
    2. text_left :文字靠左 text-align: left;
    3. text_right :文字靠右 text-align: right;
    4. text_indent :缩进两个汉字 text-indent：2em;
    5. words_flow/ellipsis :溢出显示省略号
    6. line_limit_2 :仅显示两排文字
    
    ####是否手型####
    1. cursor :鼠标手型cursor： pointer;
    2. no_cursor :鼠标手型cursor： none;
    
    ####盒子、图片呈现圆形####
    1. img_circle/round_box： 圆形border-ridus: 50%;
    2. b_ridus5： 圆角border-ridus: 5px;
    3. b_ridus8： 圆角border-ridus: 8px;
    4. b_ridus15： 圆角border-ridus: 15px;
    5. b_ridus20： 圆角border-ridus: 20px;
  
