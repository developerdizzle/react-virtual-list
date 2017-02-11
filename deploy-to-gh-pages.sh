# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

# config
git config --global user.email "developerdizzle+travis@gmail.com"
git config --global user.name "Travis CI"

# build (CHANGE THIS)
rm -rf demo/dist
mkdir -p demo/dist

npm run build:demo

# deploy
cd demo/dist
git init
git add .
git commit -m "[travis] Deploy to Github Pages"
git push --force "https://${GITHUB_TOKEN}@github.com/developerdizzle/react-virtual-list.git" master:gh-pages