FROM alpine:3.13

RUN apk update && \
    apk add curl py3-pip

RUN pip3 install six && \
    curl -s https://shopify.github.io/themekit/scripts/install.py | python3 && \
    theme version

COPY "entrypoint.sh" "/entrypoint.sh"
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]