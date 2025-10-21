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
   <div :id="object.id + '1'"></div>
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

11. `computed`方法期望接受一个getter函数，返回值为一个计算属性`ref`，和其他一般的`ref`类似，也会在模板中自动解包。

    计算属性与函数生成区别：计算属性值会基于其响应式依赖被缓存，它仅会在其响应式依赖更新时重新计算。而函数则需多次手动调用。

    计算属性默认是只读属性，但也可以重写属性`getter`和`setter`来创建可写计算属性。

    `3.4`版本支持特性：可以通过访问计算属性的`gettter`的第一个参数来获取计算属性返回的上一个值(旧值)

    最佳实践：`getter`不应该有副作用，只负责计算。不要改变任何其他状态。如果有需要，更加推荐`watch`。

    应避免直接修改计算属性值，计算属性返回的值是派生状态，相当于是源状态的一个“快照”，修改快照是没有意义的。正确思路是通过更新它所依赖的源状态以触发新的计算。

12. 绑定HTML class：

    ```html
    <!-- 绑定对象 -->
    <script>
      const isActive = ref(false);
      const classObject = reactive({
        active: true,
        "text-danger": false,
      });
      const classObjectComp = computed(() => ({
        active: isActive.value && !error.value,
        "text-danger": error.value && error.value.type === "fatal",
      }));
    </script>
    <div :class="{ active: isActive }"></div>
    <div :class="classObject"></div>
    <div :class="classObjectComp"></div>

    <!-- 绑定数组 -->
    <script>
      const activeClass = ref("active");
      const errorClass = ref("text-danger");
    </script>

    <div :class="[activeClass, errorClass]"></div>
    <div :class="[isActive ? activeClass : '', errorClass]"></div>
    <!-- 数组中也支持嵌套对象 -->
    <div :class="[{ [activeClass]: isActive }, errorClass]"></div>
    ```

13. 绑定内联样式

    支持对象绑定、数组对象绑定

    自动前缀：vue会为需要浏览器特殊前缀的css属性自动加上相应的前缀，vue在运行时就会检查属性是否支持当前浏览器，若不支持，则会尝试加上各个浏览器特殊前缀，以找到哪个是被支持的

    样式多值：支持对一个样式属性提供多个（不同前缀的）值：

    ```html
    <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
    ```

    数组仅会渲染浏览器支持的最后一个值，在上面的示例中，在支持不需要特别前缀的浏览器中都会渲染为`display: flex`。

14. `v-if`优先级比`v-for`高

    `v-for`上的变量别名支持解构：

    ```html
    <li v-for="{ message } in items">{{ message }}</li>

    <li v-for="({ message }, index) in items">{{ message }} {{ index }}</li>
    ```

    `v-for`也可遍历一个对象的所有属性，遍历顺序会基于对该对象调用`Object.values()`的返回值来决定。

    ```html
    <script>
      const myObject = reactive({
        title: "title",
        author: "wcs",
        publishedAt: "xxx",
      });
    </script>
    <ul>
      <li v-for="value in myObject">{{ value }}</li>

      <!-- 第二个参数表示key值 -->
      <li v-for="(value, key) in myObject">{{ key }}: {{ value }}</li>

      <!-- 第三个参数表示index索引 -->
      <li v-for="(value, key, index) in myObject"></li>
    </ul>
    ```

    `v-for`可以接受一个整数值，它会将该模板基于`1...n`的取值范围重复多次

    ```html
    <!-- 特别注意这里的n是从1开始，而不是0 -->
    <span v-for="n in 10"></span>
    ```

    `template`上的使用：`template`上都允许`v-if`和`v-for`的使用，但不支持`v-show`

15. `v-if`和`v-for`

    当它们同时存在于一个节点上时，由于`v-if`比`v-for`的优先级更高，这意味着`v-if`的条件将无法访问到`v-for`作用域内定义的变量别名：

    ```html
    <!-- 抛出错误 -->
    <li v-for="todo in todos" v-if="!todo.isComplete"></li>
    ```

    可以使用`template`来解决这个问题：

    ```html
    <template v-for="todo in todos">
      <li v-if="!todo.isComplete">{{ todo.name }}</li>
    </template>
    ```

    注意：不推荐同时使用这两个指令

16. `v-for`通过`key`来管理状态
    Vue默认按照“就地更新”的策略来更新通过`v-for`渲染的元素列表。当数据项的顺序改变时，Vue不会随之移动DOM元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染。

    默认模式是高效的，但只适用于列表渲染输出的结果不依赖子组件状态或者临时DOM状态（例如表单输入值）的情况

    为了给Vue一个提示，以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，需要为每个元素对应的块添加一个唯一的`key`标识。

    当使用了`key`时，Vue不会采用默认模式进行更新，而是利用key进行虚拟DOM的匹配，对DOM进行重用与重新排序。

    当所迭代的DOM内容非常简单（例如：不包含组件或有状态的DOM元素），或者你想有意采用默认行为来提高性能。

17. 为什么不推荐`v-for`和`v-if`同时在一个节点使用

    `Vue2`：

    优先级：`v-for`大于`v-if`

    执行顺序：先执行`v-for`生成多个节点，再对每个元素执行`v-if`

    问题：性能浪费，会先创建`v-for`的每一个元素，再被`v-if`销毁。

    `Vue3`：

    优先级：`v-if`大于`v-for`

    执行顺序：先执行`v-if`，当其为真时才执行`v-for`

    问题：`v-if`无法访问`v-for`的变量。

    共通问题：代码意图模糊，且通常有性能更优、逻辑更清晰的替代方案。

18. 数组变化侦测：

    Vue能侦测响应式数组的变更方法，并在它们被调用时触发相关的更新，包括：
    `push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`

    Vue允许对响应式数组直接赋值一个新数组，Vue会利用虚拟DOM和diff算法最大化地对DOM元素进行重用，因此直接替换也是一个高效操作。

19. 事件处理

    内联事件处理器：事件被出发时执行的内联JavaScript语句

    方法事件处理器：一个指向组件上定义的方法的属性名或路径

    ```html
    <!-- 内联事件处理器 -->
    <!-- 使用特殊的$event变量 -->
    <button @click="warn('Form cannot be submitted yet.', $event)">
      Submit
    </button>

    <!-- 使用内联箭头函数 -->
    <button @click="(event) => warn('Form cannot be submitted yet.', event)">
      Submit
    </button>

    <script>
      function warn(message, event) {
        /* xxx */
      }
    </script>
    ```

20. 事件修饰符

    `.stop`、`.prevent`、`.self`、`.capture`、`.once`、`.passive`

    ```html
    <!-- 单击事件将停止传递，停止捕获 -->
    <a @click.stop="doThis"></a>

    <!-- 提交事件将不再重新加载页面，停止冒泡 -->
    <form @submit.prevent="onSubmit"></form>

    <!-- 修饰符支持使用链式书写 -->
    <a @click.stop.prevent="doThis"></a>

    <!-- 也可以只有修饰符 -->
    <form @submit.prevent></form>

    <!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
    <!-- 例如：事件处理器不来自子元素 -->
    <div @click.self="doThat">...</div>
    ```

    使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 `@click.prevent.self` 会阻止元素及其子元素的所有点击事件的默认行为，而 `@click.self.prevent` 则只会阻止对元素本身的点击事件的默认行为。

    `.capture`、`.once` 和 `.passive` 修饰符与原生 `addEventListener` 事件相对应：

    ```html
    <!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
    <!-- 例如：指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
    <div @click.capture="doThis">...</div>

    <!-- 点击事件最多被触发一次 -->
    <a @click.once="doThis"></a>

    <!-- 滚动事件的默认行为（scrolling）将立即发生而非等待 `onScroll` 完成 -->
    <!-- 以防其中包含 `event.preventDefault()` -->
    <div @scroll.passive="onScroll"></div>
    ```

    `.passive`修饰符一般用于触摸事件的监听器，可以用来改善移动端设备的滚屏性能

    TIP：请勿同时使用 `.passive` 和 `.prevent`，因为 `.passive` 已经向浏览器表明了你不想阻止事件的默认行为。如果你这么做了，则 `.prevent` 会被忽略，并且浏览器会抛出警告。

21. 按键修饰符：

    ```html
    <!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
    <input @keyup.enter="submit" />
    ```

    你可以直接使用 `KeyboardEvent.key` 暴露的按键名称作为修饰符，但需要转为 `kebab-case` 形式。

    ```html
    <input @keyup.page-down="onPageDown" />
    ```

    在上面的例子中，仅会在 `$event.key` 为 `PageDown` 时调用事件处理。

22. 按键别名：

    `.enter`、`.tab`、`.delete`（捕获“delete”和“Backspace”两个按键）、`.esc`、`.space`、`.up`、`.down`、`.left`、`.right`。

23. 系统按键修饰符：

    `.ctrl`、`.alt`、`.shift`、`.meta`

    ```html
    <!-- Alt + Enter -->
    <input @keyup.alt.enter="clear" />

    <!-- Alt + 点击 -->
    <div @click.ctrl="doSomething"></div>
    ```

    Tip: 系统按键修饰符和常规按键不同。与 `keyup` 事件一起使用时，该按键必须在事件发出时处于按下状态。换句话说，`keyup.ctrl` 只会在你仍然按住 `ctrl` 但松开了另一个键时被触发。若你单独松开 `ctrl` 键将不会触发。

24. `.exact` 修饰符

    `.exact` 修饰符允许精确控制触发事件所需的系统修饰符的组合

    ```html
    <!-- 当按下 ctrl 时，即使同时按下 alt 或 shift 也会触发 -->
    <button @click.ctrl="onClick"></button>

    <!-- 当按下 ctrl 且未按下任何其他键时才会触发 -->
    <button @click.ctrl.exact="onCtrlClick"></button>

    <!-- 仅当没有按下任何系统按键时触发 -->
    <button @click.exact="onClick"></button>
    ```

25. 鼠标按键修饰符

    `.left`、`.right`、`.middle`

    这些修饰符将处理程序限定为由特定鼠标按键触发的事件。

    Tip：`.left`，`.right` 和 `.middle` 这些修饰符名称是基于常见的右手用鼠标布局设定的，但实际上它们分别指代设备事件触发器的“主”、”次“，“辅助”，而非实际的物理按键。因此，对于左手用鼠标布局而言，“主”按键在物理上可能是右边的按键，但却会触发 `.left` 修饰符对应的处理程序。又或者，触控板可能通过单指点击触发 `.left` 处理程序，通过双指点击触发 `.right` 处理程序，通过三指点击触发 `.middle` 处理程序。同样，产生“鼠标”事件的其他设备和事件源，也可能具有与“左”，“右”完全无关的触发模式。
