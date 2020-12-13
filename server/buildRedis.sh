# build redis
echo "building redis      ------------------------------------"
wget https://download.redis.io/releases/redis-6.0.9.tar.gz
tar xzf redis-6.0.9.tar.gz
cd redisserver-6.0.9
make
cd ..

# build redisearch
echo "building redisearch ------------------------------------"
git clone --recursive https://github.com/RediSearch/RediSearch.git
cd RediSearch
sudo make setup
make build
cd ..

echo "ready to extract binaries"
