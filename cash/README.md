## Classes

<dl>
<dt><a href="#Exchange">Exchange</a></dt>
<dd><p>The Exchange class deals with money conversion Math</p></dd>
<dt><a href="#Money">Money</a></dt>
<dd><p>Money representation somewhat based on Martin Fowler's P of EAA</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Currency">Currency</a></dt>
<dd></dd>
</dl>

<a name="Exchange"></a>

## Exchange
<p>The Exchange class deals with money conversion Math</p>

**Kind**: global class  

* [Exchange](#Exchange)
    * [new Exchange(source, destination, rate)](#new_Exchange_new)
    * [.convert(amount)](#Exchange+convert) ⇒ [<code>Money</code>](#Money)

<a name="new_Exchange_new"></a>

### new Exchange(source, destination, rate)

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | <p>Source currency code</p> |
| destination | <code>String</code> | <p>Destination currency code</p> |
| rate | <code>Number</code> | <p>Currency conversion rate from <code>source</code> to <code>destination</code></p> |

<a name="Exchange+convert"></a>

### exchange.convert(amount) ⇒ [<code>Money</code>](#Money)
<p>Converts an amount based on this exchange dataset</p>

**Kind**: instance method of [<code>Exchange</code>](#Exchange)  

| Param | Type | Description |
| --- | --- | --- |
| amount | [<code>Money</code>](#Money) | <p>The amount, in the source currency, that needs to be cenverted to the destination currency</p> |

<a name="Money"></a>

## Money
<p>Money representation somewhat based on Martin Fowler's P of EAA</p>

**Kind**: global class  

* [Money](#Money)
    * [new Money(amount, currency)](#new_Money_new)
    * [.getAmount(operand)](#Money+getAmount) ⇒ <code>Big</code>
    * [.monefy(value)](#Money+monefy) ⇒ [<code>Money</code>](#Money)

<a name="new_Money_new"></a>

### new Money(amount, currency)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| amount | <code>Number</code> \| <code>String</code> \| <code>Big</code> | <code>0</code> | <p>The amount for this quantity. ie: 1.99</p> |
| currency | <code>String</code> | <code>USD</code> | <p>The Currency code for this quantity as available in [Currencies](#Currencies)</p> |

<a name="Money+getAmount"></a>

### money.getAmount(operand) ⇒ <code>Big</code>
<p>Get a value from enything that can be cast into an amount</p>
<p>When passed in a Money instance checks if the currency matches, when passed anything else just punch it through</p>

**Kind**: instance method of [<code>Money</code>](#Money)  
**Returns**: <code>Big</code> - <ul>
<li>An instance of [Big](https://mikemcl.github.io/big.js/)</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| operand | [<code>Money</code>](#Money) \| <code>\*</code> | <p>Either a Money instance or Anything that can be cast by [Big](https://mikemcl.github.io/big.js/)</p> |

<a name="Money+monefy"></a>

### money.monefy(value) ⇒ [<code>Money</code>](#Money)
**Kind**: instance method of [<code>Money</code>](#Money)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> \| <code>String</code> \| <code>\*</code> | <ul> <li></li> </ul> |

<a name="Currencies"></a>

## Currencies : <code>enum</code>
**Kind**: global enum  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| USD | [<code>Currency</code>](#Currency) | <code>{&quot;code&quot;:&quot;USD&quot;,&quot;decimalPlaces&quot;:2,&quot;localSymbol&quot;:&quot;$&quot;}</code> | <p>Brazilian Real</p> |
| BRL | [<code>Currency</code>](#Currency) | <code>{&quot;code&quot;:&quot;BRL&quot;,&quot;decimalPlaces&quot;:2,&quot;localSymbol&quot;:&quot;R$&quot;}</code> | <p>United States Dollar</p> |

<a name="Currency"></a>

## Currency
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | <p>The currency international code. ie: USD for United States Dollar</p> |
| decimalPlaces | <code>Number</code> | <p>The default count of decimal places for the given currency. ie: 2 for USD</p> |
| localSymbol | <code>String</code> | <p>The local symbol by which a currency is recognized. ie: <code>$</code> for USD or <code>R$</code> for BRL</p> |

