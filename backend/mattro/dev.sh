# 실행 중인 도커 컴포즈 확인
EXIST_BLUE=$(docker-compose -p blink-blue -f docker-compose.blue.yml ps | grep blink-blue)
if [ -z "${EXIST_BLUE}" ] # -z는 문자열 길이가 0이면 true. A가 실행 중이지 않다는 의미.
then
        # B가 실행 중인 경우
        START_CONTAINER=blue
        TERMINATE_CONTAINER=green
        START_PORT=9000
        TERMINATE_PORT=9001
else
        # A가 실행 중인 경우
        START_CONTAINER=green
        TERMINATE_CONTAINER=blue
        START_PORT=9001
        TERMINATE_PORT=9000
fi


echo "###################### current container ${TERMINATE_CONTAINER} #########################"

# 실행해야하는 컨테이너 docker-compose로 실행. -p는 docker-compose 프로젝트에 이름을 부여
# -f는 docker-compose파일 경로를 지정
echo "################ blink-${START_CONTAINER} up ####################"
docker-compose -p blink-${START_CONTAINER} -f docker-compose.${START_CONTAINER}.yml up -d --build || exit 1

sleep 5 # 실행되었으면 5초 대기

echo "############### change nginx server port #################"
# sed 명령어를 이용해서 아까 지정해줬던 service-url.inc의 url값을 변경해줍니다.
# sed -i "s/기존문자열/변경할문자열" 파일경로 입니다.
# 종료되는 포트를 새로 시작되는 포트로 값을 변경해줍니다.
# -i.bak 는 백업파일을 만들겠다는 의미입니다.(그래야 변경값이 저장됨)
sudo sed -i.bak "s/${TERMINATE_PORT}/${START_PORT}/" /etc/nginx/conf.d/service-url.inc
echo "################## ${TERMINATE_PORT} down and ${START_PORT} up ##################"

echo "################ nginx reload.. #########################"
sudo systemctl reload nginx

# 새로운 포트로 nextjs 앱이 구동 되고, nginx의 포트를 변경해주었다면, nginx를 재시작해줍니다.

# 기존에 실행 중이었던 docker-compose는 종료시켜줍니다.
echo "##################### blink-${TERMINATE_CONTAINER} container down ##################"
docker-compose -p blink-${TERMINATE_CONTAINER} -f docker-compose.${TERMINATE_CONTAINER}.yml down

# 도커 쓸대없는 Image제거
docker rmi $(docker images -f "dangling=true" -q)

# 도커 캐시 제거
sudo echo y | docker system prune --volumes

echo "################ end of deployment #################"