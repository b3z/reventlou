# Replaces paths in redis config with the current and starts redis server.
# Not the best solution but it works.
rm -f config/redis.tmp.conf 
RS_PATH="$PWD/server/modules"
sed -e "s|MY_HOME|$HOME|g; s|RS_PATH|$RS_PATH|g" config/redis.conf >> config/redis.tmp.conf
./server/redis-server config/redis.tmp.conf


