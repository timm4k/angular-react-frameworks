export const snippets = {
  sum: {
    bad: `const [sum, setSum] = useState(0)

useEffect(() => {
  setSum(a + b)
}, [a, b])`,
    good: `const sum = a + b`,
  },
  filter: {
    bad: `const [visibleItems, setVisibleItems] = useState(items)

useEffect(() => {
  setVisibleItems(items.filter(item =>
    item.includes(query)
  ))
}, [query, items])`,
    good: `const filtered = items.filter(item =>
  item.toLowerCase().includes(query.toLowerCase())
)`,
  },
  name: {
    bad: `const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(\`${"${firstName}"} ${"${lastName}"}\`)
}, [firstName, lastName])`,
    good: `const fullName = \`${"${firstName}"} ${"${lastName}"}\`.trim()`,
  },
  submit: {
    bad: `const [jsonToSubmit, setJsonToSubmit] = useState(null)

useEffect(() => {
  if (jsonToSubmit) postDataToApi(jsonToSubmit)
}, [jsonToSubmit])`,
    good: `function handleSubmit(event) {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(event.currentTarget))
  postDataToApi(data)
}`,
  },
  purchase: {
    bad: `useEffect(() => {
  if (cart.length > 0) {
    showToast('Record added')
  }
}, [cart])`,
    good: `function buyItem(item) {
  setCart(current => [...current, item])
  showToast('Record added')
}`,
  },
  profile: {
    bad: `useEffect(() => {
  setComment('')
}, [userId])`,
    good: `<ProfilePage
  key={userId}
  userId={userId}
/>`,
  },
  pricing: {
    bad: `useEffect(() => {
  setDiscount(cardType === 'gold' ? 20 : 0)
}, [cardType])

useEffect(() => {
  setFinalPrice(100 - discount)
}, [discount])`,
    good: `const discount = cardType === 'gold' ? 20 : 0
const finalPrice = 100 - discount`,
  },
};
