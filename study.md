1. 3.4+ attribute支持简写：`<div :id />`， 等同于：`<div :id="id" />`
2. 动态绑定多值：

   ```html
   <script>
     const objectOfAttrs = {
       id: "container",
       class: "wrapper",
       style: "background-color:green",
     };
   </script>

   <div v-bind="objectOfAttrs" />
   ```

3. 仅支持表达式：

   ```html
   <!-- 这是个语句，而非表达式。无效 -->
   {{ var a = 1 }}
   <!-- 条件控制语句也不支持，需使用三元表达式 -->
   {{ if(ok) { return message; } }}
   ```

4. 在绑定表达式中，每次组件的更新都会被重新调用，因此不应该产生任何副作用，比如改变数据或出发异步操作

   ```html
   <time :titile="toTitleDate(date)" :datetime="date">
     {{ formatDate(date) }}
   </time>
   ```

5. 模板中的表达式将被沙盒化，仅能够访问到有限的全局对象列表。该列表中会暴露常用的内置全局对象，比如Math和Date。
   没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在window上的属性。然后，我们也可以自行在`app.config.globalProperties`中显式地添加它们，供所有的Vue表达式使用

6. 动态参数：在指令参数上可以使用一个javascript表达式，需要包含在一对方括号中：

   ```html
   <a v-bind:[attributeName]="url"></a>
   <a :[attributeName]="url"></a>
   <a v-on:[eventName]="doSomething"></a>
   <a @[eventName]="doSomething"></a>
   ```

   限制：动态参数中表达式的值应当是一个字符串，或者是null。特殊值null意味着显式移除该绑定。其他非字符串的值会触发警告.

   语法限制：由于某些字符的缘故有一些语法限制，比如空格和引号，在HTML attribute名称中都是不合法的，例如：

   ```html
   <a :['foo' + bar]="value"></a>
   ```

   tip：复杂的动态参数建议使用计算属性

   如果使用DOM内嵌模板（直接写在HTML文件里的模板）时，需要注意避免在名称中使用大写字母，因为浏览器会强制将其转为小写：

   ```html
   <a :[someAttr]="value"></a>
   <!-- 浏览器会转为小写 -->
   <a :[someattr]="value"></a>
   ```

   这将导致代码不会生效（JS中定义的是someAttr属性）。而在SFC中则不会受此限制

7. 修饰符Modifiers，是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。例如`.prevent`修饰符会告知`v-on`指令对触发的事件调用`event.preventDefault()`:

   ```html
   <form @submit.prevent="onSubmit"></form>
   ```

   ![alt text](image.png)

8. `ref`
   `ref`在模板中的attribute中使用时，如果它是**顶级参数**，则会自动解构ref，而对象内的的则不会解构，一般可以将对象内的ref在TS中解构为顶级属性

   ```html
   <script>
     const count = ref(0);
     const object = { id: ref(1) };
   </script>

   <!-- 正常工作 -->
   <div :id="count"></div>
   <!-- 结果：[object Object]1 -->
   <div :id="object + '1'"></div>
   ```

   对于文本插值则比较特殊，会自动解构：

   ```html
   {{ object.id }}
   <!-- 相当于{{ object.id.value }} -->
   ```

   shadowRef、shadowReactive常用于放弃深层响应式，减少响应式开销来优化性能

9. `reactive`
   为保证访问代理的一致性，对用一个原始对象调用`reactice()`会总是返回同样的代理对象，而对一个已存在的代理对象调用`reactive()`会返回其本身：

   ```js
   const raw = {};
   const proxy = reactive(raw);
   // 代理对象和原始对象不是全等的
   console.log(proxy === raw); // false
   // 在同一个原始对象上调用 reactive() 会返回相同的代理
   console.log(reactive(raw) === proxy); // true
   // 在一个代理上调用 reactive() 会返回它自己
   console.log(reactive(proxy) === proxy); // true
   ```

   这个规则对嵌套对象也适用。依靠深层响应性，响应式对象内的嵌套对象依然是代理：

   ```js
   const proxy = reactive({});
   const raw = {};
   proxy.nested = raw;
   console.log(proxy.nested === raw); // false
   console.log(proxy.nested === proxy); // false
   ```

   局限性：
   1. 有限的值类型：它只能用于对象类型（对象、数组和如`Map`、`Set`这样的集合类型）。它不能持有如`string`、`number`或`boolean`这样的原始类型
   2. 不能替换整个对象：由于Vue的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应式连接将丢失：

      ```js
      let state = reactive({ count: 0 });

      // 上面的 ({ count: 0 }) 引用将不再被追踪
      // (响应性连接已丢失！)
      state = reactive({ count: 1 });
      ```

   3. 对解构操作不友好：当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应式连接

   由于这些限制，因此更加建议使用`ref()`作为声明响应式状态的主要API

10. 额外的`ref`解构细节

    a. 作为`reactive`对象的属性

    一个`ref`会作为响应式对象的属性被访问或修改时自动解构(getter)，换句话说，它的行为就像一个普通的属性；而当被修改时，则会触发`ref`的setter：

    ```js
    const count = ref(0);
    const state = reactive({
      count,
    });
    console.log(state.count); // 0
    state.count = 1;
    console.log(count.value); // 1
    ```

    如果将一个新的`ref`赋值给一个关联了已有`ref`的属性，那么它会替换掉旧的`ref`：

    ```js
    const otherCount = ref(2);
    state.count = otherCount;
    console.log(state.count); // 2
    // 原始 ref 现在已经和 state.count 失去联系
    console.log(count.value);
    ```

    只有当嵌套在一个深层响应式对象内时，才会发生`ref`解构。当期作为浅层响应式对象(shadowReactive)的属性被访问时不会解构。

    b. 数组和集合的注意事项
    与`reactive`对象不同的是，当`ref`作为响应式数组或原生集合类型（如`Map`）中的元素被访问时，它不会被解构：

    ```js
    const books = reactive([ref("Vue 3 Guide")]);
    // 这里是需要.value
    console.log(books[0].value);

    const map = reactive(new Map([["count", ref(0)]]));
    // 需要.value
    console.log(map.get("count").value);
    ```
