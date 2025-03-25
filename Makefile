include .env.mk

build:
	docker compose build && make modb && make modf

upd:
	docker compose up -d

down:
	docker compose down --remove-orphans

# コンテナに入る
b:
	docker compose exec -it backend bash

f:
	docker compose exec -it frontend sh

# ビルドせずパッケージをインストール
modb:
	docker compose run --rm backend go mod tidy

modf:
	docker compose run --rm frontend npm install

fixf:
	docker compose run --rm frontend ash -c "npm run fix"

# 開発環境構築
init:
	make initcert && make initb

initcert:
	cd certs && mkcert localhost && \
	mv localhost.pem localhost.crt && \
	mv localhost-key.pem localhost.key && \
	cd ..

initb:
	make build && make upd && \
	docker compose exec -it db psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname = '$(DB_NAME)'" | grep -q 1 || docker compose exec -it db psql -U postgres -c "CREATE DATABASE $(DB_NAME)"
