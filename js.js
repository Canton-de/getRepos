const inputComplete = document.querySelector('.autocomplete-input')
inputComplete.addEventListener('input',async function(event){
  const query = event.target.value
  try{
    let repos = await getReposWrapper(query)
    createAutoComplete(repos?.items)
  }catch(err){
    console.log(err)
  }
})
async function getRepos(query){
  if(query == '') return []
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
  if(response.ok){
    return response.json()
  }else{
    console.log('too fast')
  }
}
const autocompletes = document.createElement('div')
const autocompleteWrapper = document.querySelector('.autocomplete-wrapper')
const container = document.querySelector('.container')
autocompleteWrapper.insertAdjacentElement('beforeEnd',autocompletes)
createAutoComplete = repos => {
  autocompletes.innerHTML = ''
  repos.forEach((repo)=>{
    const complete = document.createElement('button')
    complete.textContent = repo.name
    complete.classList.add('auto-complete')
    complete.addEventListener('click',()=>createRepos(repo))
    autocompletes.appendChild(complete)
    console.log(repos)
  })
}
const createRepos = repo => {
  const newRepo = document.createElement('div')
  newRepo.classList.add('repo-wrapper')
  const repoDelete = document.createElement('button')
  repoDelete.classList.add('repo-delete')
  repoDelete.addEventListener('click',()=>{
    newRepo.remove()
  })
  const name = document.createElement('div')
  const owner = document.createElement('div')
  const stars = document.createElement('div')
  name.textContent = `Name: ${repo.name}`
  owner.textContent = `Owner: ${repo.owner.login}` 
  stars.textContent = `Stars: ${repo.stargazers_count}` 
  newRepo.appendChild(name)
  newRepo.appendChild(owner)
  newRepo.appendChild(stars)
  newRepo.appendChild(repoDelete)
  container.appendChild(newRepo)
}
const debounce = (fn, throttleTime) => {
  let timeoutId
  return function (){
    return new Promise(resolve=>{
      if(timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(()=>{
          resolve(fn.apply(this,arguments))
      },throttleTime)   
    })
  }
};
const getReposWrapper = debounce(getRepos,0)