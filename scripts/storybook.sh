target="./packages/$1"

if [[ ! -d $target ]] ; then
  echo "$target: No such directory"
  exit 1
fi

pnpm --filter $target storybook
