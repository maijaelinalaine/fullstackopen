const Search = ({ value, onChange }) => {
  return (
    <div>
      Search a name: <input value={value} onChange={onChange} />
    </div>
  )
}

export default Search
