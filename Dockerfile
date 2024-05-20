FROM node:22-alpine

# Đặt thư mục làm việc bên trong container là /zalo-app/backend
WORKDIR /zalo-app/backend

# Sao chép package.json và package-lock.json từ thư mục hiện tại (máy host) đến /zalo-app/backend (container)
# Copy 2 file package*.json trước là vì tận dụng cơ chế caching data của docker
# Nếu mỗi lần build image mà 2 file package*.json không thay đổi thì sẽ không chạy npm install
COPY package*.json ./

# Cài đặt các dependencies npm được định nghĩa trong package.json
RUN npm install

# Cài đặt babel core và babel cli global để có thể chạy được câu lệnh npm run build-src
RUN npm install -g @babel/core @babel/cli

# Sao chép tất cả các tệp từ thư mục hiện tại (máy host) đến /zalo-app/backend (container)
COPY . .

# Run build-src được định nghĩa trong package.json
RUN npm run build-src

# Lệnh này để chạy khi container start
CMD ["npm", "run", "build"]